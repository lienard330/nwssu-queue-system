/**
 * Database initialization and migrations for NWSSU Queue System
 * Run: node scripts/init-db.js
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const dbPath = join(dataDir, 'queue.db');
const db = new Database(dbPath);

db.exec(`
-- Services (core service definitions)
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Open',
  avg_time INTEGER DEFAULT 5,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Service configuration (daily limit, cutoff, carry-over policy)
CREATE TABLE IF NOT EXISTS service_config (
  service_id TEXT PRIMARY KEY REFERENCES services(id),
  daily_limit INTEGER DEFAULT 100,
  cutoff_time TEXT DEFAULT '17:00',
  carry_over_expire_days INTEGER DEFAULT 3,
  carry_over_serve_first INTEGER DEFAULT 0,
  carry_over_ratio_regular INTEGER DEFAULT 2,
  carry_over_ratio_carry INTEGER DEFAULT 1,
  priority_always_first INTEGER DEFAULT 0,
  priority_ratio_regular INTEGER DEFAULT 3,
  priority_ratio_priority INTEGER DEFAULT 1,
  grace_period_minutes INTEGER DEFAULT 5,
  allow_recall INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tickets (queue entries)
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_number TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL,
  service_id TEXT NOT NULL REFERENCES services(id),
  status TEXT NOT NULL DEFAULT 'WAITING',
  is_carry_over INTEGER DEFAULT 0,
  is_walk_in INTEGER DEFAULT 0,
  original_request_date TEXT,
  joined_at TEXT DEFAULT (datetime('now')),
  called_at TEXT,
  confirmed_at TEXT,
  completed_at TEXT,
  window_id INTEGER,
  recall_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  CHECK (status IN ('WAITING', 'CALLED', 'IN_SERVICE', 'DONE', 'NO_SHOW', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_tickets_student_id ON tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_tickets_service_id ON tickets(service_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_joined_at ON tickets(joined_at);
CREATE INDEX IF NOT EXISTS idx_tickets_is_carry_over ON tickets(is_carry_over);

-- Priority requests (PWD, Pregnant, Emergency)
CREATE TABLE IF NOT EXISTS priority_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  decided_by TEXT,
  decided_at TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  CHECK (reason IN ('PWD', 'Pregnant', 'Medical Emergency')),
  CHECK (status IN ('PENDING', 'APPROVED', 'DOWNGRADED'))
);

CREATE INDEX IF NOT EXISTS idx_priority_ticket ON priority_requests(ticket_id);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id TEXT,
  action TEXT NOT NULL,
  ticket_id INTEGER,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- Students (for lookup; auth can remain mock)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT,
  year TEXT,
  email TEXT
);

-- Staff (for audit)
CREATE TABLE IF NOT EXISTS staff (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT
);

-- Daily counters for limit tracking
CREATE TABLE IF NOT EXISTS daily_counts (
  service_id TEXT NOT NULL,
  date TEXT NOT NULL,
  regular_issued INTEGER DEFAULT 0,
  carry_over_issued INTEGER DEFAULT 0,
  PRIMARY KEY (service_id, date)
);
`);

// Seed default services and config
const services = [
  { id: 'EN', name: 'Enrollment', description: 'Course enrollment and registration', avgTime: 5 },
  { id: 'CL', name: 'Clearance', description: 'Student clearance processing', avgTime: 8 },
  { id: 'TR', name: 'Transcript Request', description: 'Official transcript of records', avgTime: 15 },
  { id: 'IP', name: 'INC Processing', description: 'Incomplete grade processing', avgTime: 10 },
];

const insertService = db.prepare(`
  INSERT OR IGNORE INTO services (id, name, description, avg_time) VALUES (?, ?, ?, ?)
`);

const insertConfig = db.prepare(`
  INSERT OR IGNORE INTO service_config (service_id) VALUES (?)
`);

for (const s of services) {
  insertService.run(s.id, s.name, s.description, s.avgTime);
  insertConfig.run(s.id);
}

// Seed students from mock
const students = [
  ['2023-12345', 'Cruz, Juan', 'BSIT', '3rd Year', 'juan.cruz@nwssu.edu.ph'],
  ['2023-12347', 'Reyes, Ana Marie', 'BSBA', '2nd Year', 'anamarie.reyes@nwssu.edu.ph'],
  ['2023-12348', 'Lopez, Ben', 'BSED', '4th Year', 'ben.lopez@nwssu.edu.ph'],
  ['2023-12349', 'Garcia, Tom', 'BSIT', '1st Year', 'tom.garcia@nwssu.edu.ph'],
];

const insertStudent = db.prepare(`
  INSERT OR IGNORE INTO students (id, name, course, year, email) VALUES (?, ?, ?, ?, ?)
`);

for (const st of students) {
  insertStudent.run(...st);
}

// Staff for audit
const staff = [
  ['admin', 'Admin User', 'Administrator'],
  ['staff', 'Maria Santos', 'Registrar Staff'],
  ['operator', 'M. Lopez', 'Window Operator'],
];

const insertStaff = db.prepare(`
  INSERT OR IGNORE INTO staff (username, name, role) VALUES (?, ?, ?)
`);

for (const s of staff) {
  insertStaff.run(...s);
}

db.close();
console.log('Database initialized at', dbPath);
