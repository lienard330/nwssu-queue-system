/**
 * Services API routes
 */
import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.put('/:id/config', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowed = [
      'daily_limit', 'cutoff_time', 'carry_over_expire_days',
      'carry_over_serve_first', 'carry_over_ratio_regular', 'carry_over_ratio_carry',
      'priority_always_first', 'priority_ratio_regular', 'priority_ratio_priority',
      'grace_period_minutes', 'allow_recall',
    ];
    const setClause = [];
    const values = [];
    for (const k of allowed) {
      if (updates[k] !== undefined) {
        setClause.push(`${k} = ?`);
        values.push(updates[k]);
      }
    }
    if (setClause.length === 0) return res.status(400).json({ success: false, error: 'No valid fields to update' });
    setClause.push("updated_at = datetime('now')");
    values.push(id);
    db.prepare(`UPDATE service_config SET ${setClause.join(', ')} WHERE service_id = ?`).run(...values);
    const config = db.prepare('SELECT * FROM service_config WHERE service_id = ?').get(id);
    res.json({ success: true, config });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT s.*, sc.daily_limit, sc.cutoff_time, sc.grace_period_minutes
      FROM services s
      LEFT JOIN service_config sc ON s.id = sc.service_id
    `).all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id/config', (req, res) => {
  try {
    const config = db.prepare('SELECT * FROM service_config WHERE service_id = ?').get(req.params.id);
    res.json(config || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
