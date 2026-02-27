# NWSSU Queue System — Backend Implementation

## Database Schema

### Tables

- **services** — Core service definitions (EN, CL, TR, IP)
- **service_config** — Per-service: daily_limit, cutoff_time, carry_over policy, priority policy, grace_period
- **tickets** — Queue entries with status: WAITING, CALLED, IN_SERVICE, DONE, NO_SHOW, CANCELLED
- **priority_requests** — PWD/Pregnant/Emergency requests (PENDING, APPROVED, DOWNGRADED)
- **audit_logs** — Staff ID, action, ticket_id, details, timestamp
- **students** — Student lookup
- **staff** — Staff for audit
- **daily_counts** — Per-service per-day regular_issued + carry_over_issued

### Service Config Fields

| Field | Purpose |
|-------|---------|
| daily_limit | Max queue numbers issued per day (regular + carry-over) |
| cutoff_time | Time (HH:mm) after which only carry-over tickets issued |
| carry_over_expire_days | Carry-over tickets expire after N days |
| carry_over_serve_first | Serve first X carry-over before regular |
| carry_over_ratio_* | Mix ratio (e.g., 1 carry-over : 2 regular) |
| priority_always_first | Always prioritize approved priority |
| priority_ratio_* | Controlled ratio (1 priority : 3 regular) |
| grace_period_minutes | Minutes to confirm arrival after being called |
| allow_recall | Number of recall attempts before marking NO_SHOW |

---

## Queue-Calling Algorithm

1. **Filter** — Exclude expired carry-over tickets.
2. **Priority always** — If `priority_always_first` and there are approved priority requests, pick the oldest priority ticket.
3. **Serve first carry-over** — If `carry_over_serve_first > 0` and there are carry-over tickets, pick the oldest carry-over.
4. **Ratio-based** — Otherwise:
   - If the last served was priority, pick the next non-priority (FIFO).
   - If the last served was carry-over, pick the next regular (FIFO).
   - If the last served was regular, pick the next carry-over if any, else regular.

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/queue/join | Join queue (regular or carry-over) |
| GET | /api/queue/active/:studentId | Get active ticket |
| GET | /api/queue/can-join | Check if student can join |
| POST | /api/queue/confirm-arrival | Student confirms arrival when CALLED |
| POST | /api/queue/priority/request | Request priority (ticketId, reason) |
| POST | /api/queue/priority/approve | Approve priority |
| POST | /api/queue/priority/downgrade | Downgrade priority |
| GET | /api/queue/priority-pending | List pending priority requests |
| POST | /api/queue/registrar/call-next | Call next (respects policy) |
| POST | /api/queue/mark-no-show | Mark no-show (recall or final) |
| POST | /api/queue/complete | Complete ticket |
| POST | /api/queue/transfer | Transfer to another service |
| POST | /api/queue/walk-in | Create walk-in (admin override optional) |
| GET | /api/queue/waiting/:serviceId | Waiting list (?public=true for queue # only) |
| GET | /api/queue/audit-logs | Audit logs |
| PUT | /api/services/:id/config | Update service config |
| GET | /api/services | List services |
| GET | /api/services/:id/config | Get service config |

---

## Edge-Case Handling

| Case | Handling |
|------|----------|
| Student joins when over daily limit | Issue carry-over ticket |
| Past cutoff time | Issue carry-over ticket |
| Student has active ticket | Reject join (one active per student) |
| Walk-in with admin override | Bypass daily limit |
| Carry-over ticket expired | Excluded from call-next selection |
| Priority request on non-WAITING ticket | Reject |
| Mark no-show on CALLED | First: recall to WAITING; then: mark NO_SHOW |
| Mark no-show on WAITING | Direct NO_SHOW |
| Transfer preserves | Original joined_at preserved in DB |
| Public display | Only queue_number, no names |

---

## Running the Backend

```bash
cd server
npm install
npm run init-db   # Initialize SQLite DB
npm run dev       # Start server (port 3001)
```

Frontend proxies `/api` to `http://localhost:3001` when using Vite dev server.
