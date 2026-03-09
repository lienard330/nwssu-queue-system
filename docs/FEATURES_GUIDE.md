# NWSSU Queue System — Feature Guide

**Important:** Most enhanced features require the **backend server** to be running. Start it with:

```bash
cd server && npm run init-db && npm run dev
```

Then start the frontend: `npm run dev`

---

## Where to Find Each Feature

### 1️⃣ Peak-Day Overload + Daily Limit + Cut-Off
- **Settings → System Settings** → Daily limit per service, Cut-off time, Carry-over serve first X, Carry-over expire days
- When limit/cutoff reached → student receives **Carry-Over Ticket** (shown on queue status page)

### 2️⃣ Priority Lane (PWD / Pregnant / Emergency)
- **Student:** On queue status page → "Request Priority" button → select reason (PWD, Pregnant, Medical Emergency)
- **Registrar:** **Admin Dashboard** or **Queue Detail** → "Pending Priority Requests" banner → Approve / Downgrade

### 3️⃣ Walk-In
- **Queue Detail** (Manage Queue) → **Add Walk-In** button → enter Student ID, optional admin override

### 4️⃣ No-Show & Arrival Confirmation
- **Student:** When called → **Confirm Arrival** button appears
- **Registrar:** On **Now Serving** panel → Complete, No-Show; or on Waiting List → Mark No-Show (recall supported)

### 5️⃣ One Active Queue Rule
- Enforced by backend — student cannot join if they already have an active ticket

### 6️⃣ Service Transfer
- **Queue Detail** → Waiting List → ⋮ menu → **Transfer to Service**

### 7️⃣ Privacy & Public Display
- **Landing page** → "View Public Queue Display"
- **Staff sidebar** → "Queue Display"
- URL: `/display/EN` (or CL, TR, IP) — queue numbers only, no names

### 8️⃣ Audit Trail
- **Settings → Logs** — all actions logged (backend must be running)

---

## Backend Status
- **Green banner** = Backend connected, full features enabled
- **Amber banner** = Backend not connected — run `cd server && npm run dev`
