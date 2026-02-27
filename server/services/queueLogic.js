/**
 * Queue logic: daily limits, cutoff, carry-over, priority, call-next algorithm
 */
import { db } from '../db.js';

const ACTIVE_STATUSES = ['WAITING', 'CALLED', 'IN_SERVICE'];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getTimeNow() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function parseCutoff(cutoffStr) {
  const [h, m] = (cutoffStr || '17:00').split(':').map(Number);
  return h * 60 + m;
}

function isPastCutoff(cutoffTime) {
  if (!cutoffTime) return false;
  const [h, m] = getTimeNow().split(':').map(Number);
  const nowMins = h * 60 + m;
  return nowMins >= parseCutoff(cutoffTime);
}

export function getServiceConfig(serviceId) {
  const row = db.prepare(`
    SELECT * FROM service_config WHERE service_id = ?
  `).get(serviceId);
  return row || {};
}

export function getDailyCount(serviceId) {
  const today = getToday();
  const row = db.prepare(`
    SELECT (regular_issued + carry_over_issued) as total FROM daily_counts WHERE service_id = ? AND date = ?
  `).get(serviceId, today);
  return row?.total ?? 0;
}

export function isOverDailyLimit(serviceId) {
  const config = getServiceConfig(serviceId);
  const limit = config.daily_limit ?? 9999;
  if (limit <= 0) return false;
  const count = getDailyCount(serviceId);
  return count >= limit;
}

export function shouldIssueCarryOver(serviceId) {
  const config = getServiceConfig(serviceId);
  return isOverDailyLimit(serviceId) || isPastCutoff(config.cutoff_time);
}

export function getNextSequence(serviceId) {
  const prefix = serviceId + '-';
  const row = db.prepare(`
    SELECT MAX(CAST(SUBSTR(queue_number, ?) AS INTEGER)) as seq FROM tickets
    WHERE queue_number LIKE ?
  `).get(prefix.length + 1, prefix + '%');
  const next = (row?.seq ?? 0) + 1;
  return String(next).padStart(3, '0');
}

export function hasActiveTicket(studentId) {
  const row = db.prepare(`
    SELECT id FROM tickets WHERE student_id = ? AND status IN (${ACTIVE_STATUSES.map(() => '?').join(',')})
  `).get(studentId, ...ACTIVE_STATUSES);
  return !!row;
}

export function getActiveTicketForStudent(studentId) {
  return db.prepare(`
    SELECT t.*, s.name as student_name, s.course FROM tickets t
    LEFT JOIN students s ON t.student_id = s.id
    WHERE t.student_id = ? AND t.status IN (${ACTIVE_STATUSES.map(() => '?').join(',')})
    ORDER BY t.joined_at ASC LIMIT 1
  `).get(studentId, ...ACTIVE_STATUSES);
}

function incrementDailyCount(serviceId, isCarryOver) {
  const today = getToday();
  const reg = isCarryOver ? 0 : 1;
  const carry = isCarryOver ? 1 : 0;
  db.prepare(`
    INSERT INTO daily_counts (service_id, date, regular_issued, carry_over_issued)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(service_id, date) DO UPDATE SET
      regular_issued = regular_issued + excluded.regular_issued,
      carry_over_issued = carry_over_issued + excluded.carry_over_issued
  `).run(serviceId, today, reg, carry);
}

export function createTicket(studentId, serviceId, isWalkIn = false, adminOverride = false) {
  const config = getServiceConfig(serviceId);
  const override = adminOverride && isWalkIn;

  if (!override && hasActiveTicket(studentId)) {
    return { success: false, error: 'You already have an active queue. One active ticket per student.' };
  }

  const today = getToday();
  const issueCarryOver = !override && shouldIssueCarryOver(serviceId);

  const seq = getNextSequence(serviceId);
  const queueNumber = `${serviceId}-${seq}`;

  const insertTicket = db.prepare(`
    INSERT INTO tickets (queue_number, student_id, service_id, status, is_carry_over, is_walk_in, original_request_date)
    VALUES (?, ?, ?, 'WAITING', ?, ?, ?)
  `);

  insertTicket.run(
    queueNumber,
    studentId,
    serviceId,
    issueCarryOver ? 1 : 0,
    isWalkIn ? 1 : 0,
    issueCarryOver ? today : null
  );

  if (!override) {
    incrementDailyCount(serviceId, issueCarryOver ? 1 : 0);
  }

  const ticket = db.prepare('SELECT * FROM tickets WHERE queue_number = ?').get(queueNumber);
  return {
    success: true,
    ticket,
    isCarryOver: !!issueCarryOver,
  };
}

/**
 * Select next ticket to call based on policy (carry-over + priority)
 */
export function selectNextToCall(serviceId, windowId) {
  const config = getServiceConfig(serviceId);

  const serveFirstCarryOver = config.carry_over_serve_first ?? 0;
  const carryRatioR = config.carry_over_ratio_regular ?? 2;
  const carryRatioC = config.carry_over_ratio_carry ?? 1;
  const priorityAlways = config.priority_always_first ?? 0;
  const priorityRatioR = config.priority_ratio_regular ?? 3;
  const priorityRatioP = config.priority_ratio_priority ?? 1;
  const expireDays = config.carry_over_expire_days ?? 3;

  const waiting = db.prepare(`
    SELECT t.*, s.name as student_name, s.course,
           EXISTS(SELECT 1 FROM priority_requests pr WHERE pr.ticket_id = t.id AND pr.status = 'APPROVED') as has_priority
    FROM tickets t
    LEFT JOIN students s ON t.student_id = s.id
    WHERE t.service_id = ? AND t.status = 'WAITING'
    ORDER BY t.joined_at ASC
  `).all(serviceId).filter((w) => {
    if (w.is_carry_over && w.original_request_date) {
      return !isCarryOverExpired(w.original_request_date, expireDays);
    }
    return true;
  });

  if (waiting.length === 0) return null;

  const carryOver = waiting.filter((w) => w.is_carry_over && w.original_request_date);
  const regular = waiting.filter((w) => !w.is_carry_over);
  const priority = waiting.filter((w) => w.has_priority);
  const nonPriority = waiting.filter((w) => !w.has_priority);

  let next = null;
  let pool = [];

  if (priorityAlways && priority.length > 0) {
    next = priority[0];
  } else if (serveFirstCarryOver > 0 && carryOver.length > 0) {
    next = carryOver[0];
  } else {
    const lastCalled = db.prepare(`
      SELECT is_carry_over FROM tickets WHERE service_id = ? AND status IN ('IN_SERVICE', 'DONE')
      ORDER BY called_at DESC LIMIT 1
    `).get(serviceId);
    const lastWasCarryOver = lastCalled?.is_carry_over;
    const lastWasPriority = db.prepare(`
      SELECT t.id FROM tickets t
      JOIN priority_requests pr ON pr.ticket_id = t.id AND pr.status = 'APPROVED'
      WHERE t.service_id = ? AND t.status IN ('IN_SERVICE', 'DONE')
      ORDER BY t.called_at DESC LIMIT 1
    `).get(serviceId);

    if (lastWasPriority && nonPriority.length > 0) {
      next = nonPriority[0];
    } else if (lastWasCarryOver && regular.length > 0) {
      next = regular[0];
    } else if (!lastWasCarryOver && carryOver.length > 0) {
      next = carryOver[0];
    } else {
      next = waiting[0];
    }
  }

  return next;
}

export function isCarryOverExpired(originalDate, expireDays) {
  const exp = new Date(originalDate);
  exp.setDate(exp.getDate() + (expireDays ?? 3));
  return new Date() > exp;
}
