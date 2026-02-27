/**
 * Hook for queue API operations (backend-only features)
 * Use when backend is running for: join, confirm arrival, priority, walk-in, etc.
 */
import { useState, useCallback } from 'react';
import { api, isBackendAvailable } from '../api/client';

export function useQueueApi() {
  const [backendAvailable, setBackendAvailable] = useState(null);

  const checkBackend = useCallback(async () => {
    const ok = await isBackendAvailable();
    setBackendAvailable(ok);
    return ok;
  }, []);

  const joinQueue = useCallback(async (studentId, serviceId) => {
    return api.queue.join(studentId, serviceId);
  }, []);

  const getActiveTicket = useCallback(async (studentId) => {
    const res = await api.queue.active(studentId);
    return res.ticket;
  }, []);

  const canJoin = useCallback(async (studentId, serviceId) => {
    return api.queue.canJoin(studentId, serviceId);
  }, []);

  const confirmArrival = useCallback(async (ticketId) => {
    return api.queue.confirmArrival(ticketId);
  }, []);

  const requestPriority = useCallback(async (ticketId, reason) => {
    return api.queue.priority.request(ticketId, reason);
  }, []);

  const approvePriority = useCallback(async (ticketId, staffId) => {
    return api.queue.priority.approve(ticketId, staffId);
  }, []);

  const downgradePriority = useCallback(async (ticketId, staffId, notes) => {
    return api.queue.priority.downgrade(ticketId, staffId, notes);
  }, []);

  const getPriorityPending = useCallback(async () => {
    return api.queue.priority.pending();
  }, []);

  const callNext = useCallback(async (serviceId, windowId, staffId) => {
    return api.queue.callNext(serviceId, windowId, staffId);
  }, []);

  const markNoShow = useCallback(async (ticketId, staffId) => {
    return api.queue.markNoShow(ticketId, staffId);
  }, []);

  const completeTicket = useCallback(async (ticketId, staffId) => {
    return api.queue.complete(ticketId, staffId);
  }, []);

  const transferTicket = useCallback(async (ticketId, toServiceId, staffId) => {
    return api.queue.transfer(ticketId, toServiceId, staffId);
  }, []);

  const createWalkIn = useCallback(async (studentId, serviceId, staffId, adminOverride) => {
    return api.queue.walkIn(studentId, serviceId, staffId, adminOverride);
  }, []);

  const getWaitingList = useCallback(async (serviceId, isPublic = false) => {
    return api.queue.waiting(serviceId, isPublic);
  }, []);

  const getServices = useCallback(async () => {
    return api.services.list();
  }, []);

  const getServiceConfig = useCallback(async (serviceId) => {
    return api.services.config(serviceId);
  }, []);

  const updateServiceConfig = useCallback(async (serviceId, config) => {
    return api.services.updateConfig(serviceId, config);
  }, []);

  const getAuditLogs = useCallback(async (limit, action) => {
    return api.queue.auditLogs(limit, action);
  }, []);

  return {
    backendAvailable,
    checkBackend,
    joinQueue,
    getActiveTicket,
    canJoin,
    confirmArrival,
    requestPriority,
    approvePriority,
    downgradePriority,
    getPriorityPending,
    callNext,
    markNoShow,
    completeTicket,
    transferTicket,
    createWalkIn,
    getWaitingList,
    getServices,
    getServiceConfig,
    updateServiceConfig,
    getAuditLogs,
  };
}
