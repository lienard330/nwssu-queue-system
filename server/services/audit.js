/**
 * Audit logging service
 */
import { db } from '../db.js';

const insertLog = db.prepare(`
  INSERT INTO audit_logs (staff_id, action, ticket_id, details) VALUES (?, ?, ?, ?)
`);

export function logAction(staffId, action, ticketId = null, details = null) {
  insertLog.run(staffId || 'system', action, ticketId, details ? JSON.stringify(details) : null);
}
