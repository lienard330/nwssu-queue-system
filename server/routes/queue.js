/**
 * Queue API routes
 */
import { Router } from 'express';
import { db } from '../db.js';
import { logAction } from '../services/audit.js';
import {
  createTicket,
  getActiveTicketForStudent,
  hasActiveTicket,
  selectNextToCall,
  getServiceConfig,
  getNextSequence,
  shouldIssueCarryOver,
  getDailyCount,
  isOverDailyLimit,
} from '../services/queueLogic.js';

const router = Router();

const ACTIVE_STATUSES = ['WAITING', 'CALLED', 'IN_SERVICE'];

function getStudent(studentId) {
  return db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
}

// POST /api/queue/join - Join queue (regular or carry-over)
router.post('/join', (req, res) => {
  try {
    const { studentId, serviceId } = req.body;
    if (!studentId || !serviceId) {
      return res.status(400).json({ success: false, error: 'studentId and serviceId required' });
    }
    const student = getStudent(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    const result = createTicket(studentId, serviceId, false, false);
    if (!result.success) {
      return res.status(400).json(result);
    }
    if (result.isCarryOver) {
      logAction(null, 'CARRY_OVER_ISSUED', result.ticket.id, { queue_number: result.ticket.queue_number });
    }
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
    res.json({
      success: true,
      ticket: result.ticket,
      isCarryOver: result.isCarryOver,
      service: service,
      student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/priority/request - Request priority
router.post('/priority/request', (req, res) => {
  try {
    const { ticketId, reason } = req.body;
    if (!ticketId || !reason || !['PWD', 'Pregnant', 'Medical Emergency'].includes(reason)) {
      return res.status(400).json({ success: false, error: 'Valid ticketId and reason (PWD, Pregnant, Medical Emergency) required' });
    }
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ? AND status = ?').get(ticketId, 'WAITING');
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found or not in queue' });
    }
    const existing = db.prepare('SELECT id FROM priority_requests WHERE ticket_id = ? AND status = ?').get(ticketId, 'PENDING');
    if (existing) {
      return res.status(400).json({ success: false, error: 'Priority request already pending' });
    }
    db.prepare(`
      INSERT INTO priority_requests (ticket_id, reason, status) VALUES (?, ?, 'PENDING')
    `).run(ticketId, reason);
    const pr = db.prepare('SELECT * FROM priority_requests WHERE ticket_id = ? ORDER BY id DESC LIMIT 1').get(ticketId);
    logAction(null, 'PRIORITY_REQUESTED', ticketId, { reason });
    res.json({ success: true, priorityRequest: pr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/priority/approve - Approve priority
router.post('/priority/approve', (req, res) => {
  try {
    const { ticketId, staffId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, error: 'ticketId required' });
    const pr = db.prepare('SELECT * FROM priority_requests WHERE ticket_id = ? AND status = ?').get(ticketId, 'PENDING');
    if (!pr) return res.status(404).json({ success: false, error: 'No pending priority request' });
    db.prepare(`
      UPDATE priority_requests SET status = 'APPROVED', decided_by = ?, decided_at = datetime('now') WHERE id = ?
    `).run(staffId || 'system', pr.id);
    logAction(staffId, 'PRIORITY_APPROVED', ticketId, {});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/priority/downgrade - Downgrade priority to regular
router.post('/priority/downgrade', (req, res) => {
  try {
    const { ticketId, staffId, notes } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, error: 'ticketId required' });
    const pr = db.prepare('SELECT * FROM priority_requests WHERE ticket_id = ?').get(ticketId);
    if (!pr) return res.status(404).json({ success: false, error: 'No priority request found' });
    db.prepare(`
      UPDATE priority_requests SET status = 'DOWNGRADED', decided_by = ?, decided_at = datetime('now'), notes = ? WHERE id = ?
    `).run(staffId || 'system', notes || null, pr.id);
    logAction(staffId, 'PRIORITY_DOWNGRADED', ticketId, { notes });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/registrar/call-next - Call next student
router.post('/registrar/call-next', (req, res) => {
  try {
    const { serviceId, windowId, staffId } = req.body;
    if (!serviceId) return res.status(400).json({ success: false, error: 'serviceId required' });
    const next = selectNextToCall(serviceId, windowId || 1);
    if (!next) {
      return res.json({ success: true, ticket: null, message: 'No one in queue' });
    }
    const config = getServiceConfig(serviceId);
    const graceMinutes = config.grace_period_minutes ?? 5;
    const calledAt = new Date().toISOString();
    db.prepare(`
      UPDATE tickets SET status = 'CALLED', called_at = ?, window_id = ?, updated_at = datetime('now') WHERE id = ?
    `).run(calledAt, windowId || 1, next.id);
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(next.id);
    const student = getStudent(next.student_id);
    logAction(staffId, 'CALL_NEXT', next.id, { queue_number: next.queue_number });
    res.json({
      success: true,
      ticket: { ...ticket, student_name: student?.name, course: student?.course },
      graceMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/confirm-arrival - Student confirms arrival when called
router.post('/confirm-arrival', (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, error: 'ticketId required' });
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ? AND status = ?').get(ticketId, 'CALLED');
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found or not in called state' });
    }
    const confirmedAt = new Date().toISOString();
    db.prepare(`
      UPDATE tickets SET status = 'IN_SERVICE', confirmed_at = ?, updated_at = datetime('now') WHERE id = ?
    `).run(confirmedAt, ticketId);
    const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    res.json({ success: true, ticket: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/mark-no-show - Registrar marks no-show
router.post('/mark-no-show', (req, res) => {
  try {
    const { ticketId, staffId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, error: 'ticketId required' });
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    if (ticket.status === 'CALLED') {
      const config = getServiceConfig(ticket.service_id);
      const allowRecall = config.allow_recall ?? 1;
      if (ticket.recall_count < allowRecall) {
        db.prepare(`
          UPDATE tickets SET status = 'WAITING', recall_count = recall_count + 1, called_at = NULL, updated_at = datetime('now') WHERE id = ?
        `).run(ticketId);
        logAction(staffId, 'RECALL_ATTEMPT', ticketId, { recall_count: ticket.recall_count + 1 });
        return res.json({ success: true, recalled: true });
      }
    }
    db.prepare(`
      UPDATE tickets SET status = 'NO_SHOW', updated_at = datetime('now') WHERE id = ?
    `).run(ticketId);
    logAction(staffId, 'NO_SHOW', ticketId, {});
    res.json({ success: true, recalled: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/transfer - Transfer ticket to another service
router.post('/transfer', (req, res) => {
  try {
    const { ticketId, toServiceId, staffId } = req.body;
    if (!ticketId || !toServiceId) return res.status(400).json({ success: false, error: 'ticketId and toServiceId required' });
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    const toService = db.prepare('SELECT * FROM services WHERE id = ?').get(toServiceId);
    if (!toService) return res.status(404).json({ success: false, error: 'Target service not found' });
    const seq = getNextSequence(toServiceId);
    const newQueueNum = `${toServiceId}-${seq}`;
    db.prepare(`
      UPDATE tickets SET service_id = ?, queue_number = ?, updated_at = datetime('now') WHERE id = ?
    `).run(toServiceId, newQueueNum, ticketId);
    logAction(staffId, 'TRANSFER', ticketId, { from: ticket.service_id, to: toServiceId });
    const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    res.json({ success: true, ticket: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/walk-in - Create walk-in (registrar manual entry)
router.post('/walk-in', (req, res) => {
  try {
    const { studentId, serviceId, staffId, adminOverride } = req.body;
    if (!studentId || !serviceId) return res.status(400).json({ success: false, error: 'studentId and serviceId required' });
    const student = getStudent(studentId);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    const result = createTicket(studentId, serviceId, true, !!adminOverride);
    if (!result.success) return res.status(400).json(result);
    logAction(staffId, 'WALK_IN_CREATED', result.ticket.id, { admin_override: !!adminOverride });
    res.json({ success: true, ticket: result.ticket, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/active/:studentId - Check active ticket
router.get('/active/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const ticket = getActiveTicketForStudent(studentId);
    if (!ticket) return res.json({ success: true, ticket: null });
    const student = getStudent(studentId);
    res.json({ success: true, ticket: { ...ticket, student } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/waiting/:serviceId - Get waiting list (for display - queue number only for public)
router.get('/waiting/:serviceId', (req, res) => {
  try {
    const { serviceId } = req.params;
    const { public: isPublic } = req.query;
    const rows = db.prepare(`
      SELECT t.id, t.queue_number as num, t.status, t.is_carry_over, t.is_walk_in, t.joined_at, t.window_id,
             s.name as student, s.course, t.student_id as id
      FROM tickets t
      LEFT JOIN students s ON t.student_id = s.id
      WHERE t.service_id = ? AND t.status IN ('WAITING', 'CALLED', 'IN_SERVICE')
      ORDER BY 
        CASE t.status WHEN 'IN_SERVICE' THEN 0 WHEN 'CALLED' THEN 1 ELSE 2 END,
        t.joined_at ASC
    `).all(serviceId);
    if (isPublic === 'true') {
      return res.json(rows.map((r) => ({ queue_number: r.num, status: r.status })));
    }
    res.json(rows.map((r, i) => ({ ...r, pos: i + 1 })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/can-join - Check if student can join (for UI)
router.get('/can-join', (req, res) => {
  try {
    const { studentId, serviceId } = req.query;
    if (!studentId || !serviceId) return res.status(400).json({ error: 'studentId and serviceId required' });
    const hasActive = hasActiveTicket(studentId);
    const wouldCarryOver = shouldIssueCarryOver(serviceId);
    const overLimit = isOverDailyLimit(serviceId);
    const dailyCount = getDailyCount(serviceId);
    const config = getServiceConfig(serviceId);
    res.json({
      canJoin: !hasActive,
      wouldCarryOver,
      overLimit,
      dailyCount,
      dailyLimit: config.daily_limit ?? 9999,
      error: hasActive ? 'One active queue per student' : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/complete - Complete ticket and optionally call next
router.post('/complete', (req, res) => {
  try {
    const { ticketId, staffId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, error: 'ticketId required' });
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    db.prepare(`
      UPDATE tickets SET status = 'DONE', completed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
    `).run(ticketId);
    logAction(staffId, 'COMPLETED', ticketId, {});
    const next = selectNextToCall(ticket.service_id, ticket.window_id);
    res.json({ success: true, nextTicket: next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/priority-pending - Get pending priority requests
router.get('/priority-pending', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT pr.*, t.queue_number, t.student_id, s.name as student_name
      FROM priority_requests pr
      JOIN tickets t ON pr.ticket_id = t.id
      LEFT JOIN students s ON t.student_id = s.id
      WHERE pr.status = 'PENDING'
      ORDER BY pr.created_at ASC
    `).all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/audit-logs - Get audit logs
router.get('/audit-logs', (req, res) => {
  try {
    const { limit = 100, action } = req.query;
    let sql = 'SELECT * FROM audit_logs';
    const params = [];
    if (action) {
      sql += ' WHERE action = ?';
      params.push(action);
    }
    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit, 10) || 100);
    const rows = db.prepare(sql).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
