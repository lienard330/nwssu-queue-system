/**
 * API client for NWSSU Queue System
 * Uses /api proxy when backend is available
 */
const BASE = '/api';

async function request(method, path, body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || 'Request failed');
  }
  return data;
}

export const api = {
  queue: {
    join: (studentId, serviceId) => request('POST', '/queue/join', { studentId, serviceId }),
    active: (studentId) => request('GET', `/queue/active/${studentId}`),
    canJoin: (studentId, serviceId) => request('GET', `/queue/can-join?studentId=${studentId}&serviceId=${serviceId}`),
    confirmArrival: (ticketId) => request('POST', '/queue/confirm-arrival', { ticketId }),
    waiting: (serviceId, isPublic = false) =>
      request('GET', `/queue/waiting/${serviceId}${isPublic ? '?public=true' : ''}`),
    callNext: (serviceId, windowId, staffId) =>
      request('POST', '/queue/registrar/call-next', { serviceId, windowId, staffId }),
    markNoShow: (ticketId, staffId) => request('POST', '/queue/mark-no-show', { ticketId, staffId }),
    complete: (ticketId, staffId) => request('POST', '/queue/complete', { ticketId, staffId }),
    transfer: (ticketId, toServiceId, staffId) =>
      request('POST', '/queue/transfer', { ticketId, toServiceId, staffId }),
    walkIn: (studentId, serviceId, staffId, adminOverride) =>
      request('POST', '/queue/walk-in', { studentId, serviceId, staffId, adminOverride }),
    priority: {
      request: (ticketId, reason) => request('POST', '/queue/priority/request', { ticketId, reason }),
      approve: (ticketId, staffId) => request('POST', '/queue/priority/approve', { ticketId, staffId }),
      downgrade: (ticketId, staffId, notes) =>
        request('POST', '/queue/priority/downgrade', { ticketId, staffId, notes }),
      pending: () => request('GET', '/queue/priority-pending'),
    },
    auditLogs: (limit, action) =>
      request('GET', `/queue/audit-logs?limit=${limit || 100}${action ? `&action=${action}` : ''}`),
  },
  services: {
    list: () => request('GET', '/services'),
    config: (id) => request('GET', `/services/${id}/config`),
    updateConfig: (id, config) => request('PUT', `/services/${id}/config`, config),
  },
};

export async function isBackendAvailable() {
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
