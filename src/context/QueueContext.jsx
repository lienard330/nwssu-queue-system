import { createContext, useContext, useState, useCallback } from 'react';
import { mockServices } from '../data/mockServices';
import { enrollmentServing, enrollmentWaiting, clearanceServing, clearanceWaiting } from '../data/mockQueues';

const initialQueueState = {
  services: mockServices.map((s) => ({ ...s })),
  queues: {
    EN: { serving: [...enrollmentServing], waiting: [...enrollmentWaiting], nextSeq: 16, paused: false },
    CL: { serving: [...clearanceServing], waiting: [...clearanceWaiting], nextSeq: 10, paused: false },
    TR: { serving: [], waiting: [], nextSeq: 1, paused: false },
    IP: { serving: [], waiting: [], nextSeq: 1, paused: false },
  },
};

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem('nwssu_queue_state');
      if (stored) {
        return { ...initialQueueState, ...JSON.parse(stored) };
      }
    } catch (e) {}
    return initialQueueState;
  });

  const saveToStorage = useCallback((s) => {
    try {
      localStorage.setItem('nwssu_queue_state', JSON.stringify(s));
    } catch (e) {}
  }, []);

  const getServices = useCallback(() => state.services, [state.services]);

  const getService = useCallback((id) => state.services.find((s) => s.id === id), [state.services]);

  const getQueue = useCallback((serviceId) => state.queues[serviceId] || { serving: [], waiting: [], nextSeq: 1, paused: false }, [state.queues]);

  const updateServiceStatus = useCallback((serviceId, status) => {
    setState((prev) => {
      const next = {
        ...prev,
        services: prev.services.map((s) => (s.id === serviceId ? { ...s, status } : s)),
      };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const addToQueue = useCallback((serviceId, student) => {
    setState((prev) => {
      const q = prev.queues[serviceId] || { serving: [], waiting: [], nextSeq: 1, paused: false };
      const num = `${serviceId}-${String(q.nextSeq).padStart(3, '0')}`;
      const entry = {
        pos: q.waiting.length + 1,
        num,
        student: student.name,
        id: student.id,
        course: student.course,
        waitTime: 0,
        joinedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
      const next = {
        ...prev,
        queues: {
          ...prev.queues,
          [serviceId]: {
            ...q,
            waiting: [...q.waiting, entry],
            nextSeq: q.nextSeq + 1,
          },
        },
      };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const removeFromQueue = useCallback((serviceId, queueNum) => {
    setState((prev) => {
      const q = prev.queues[serviceId];
      if (!q) return prev;
      const waiting = q.waiting.filter((w) => w.num !== queueNum).map((w, i) => ({ ...w, pos: i + 1 }));
      const next = {
        ...prev,
        queues: { ...prev.queues, [serviceId]: { ...q, waiting } },
      };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const callToWindow = useCallback((serviceId, queueNum, windowId) => {
    setState((prev) => {
      const q = prev.queues[serviceId];
      if (!q) return prev;
      const entry = q.waiting.find((w) => w.num === queueNum);
      if (!entry) return prev;
      const waiting = q.waiting.filter((w) => w.num !== queueNum).map((w, i) => ({ ...w, pos: i + 1 }));
      const windows = [{ windowId, windowName: `Window #${windowId}`, queueNum, staff: 'Staff', student: `${entry.student} (${entry.id})` }];
      const serving = q.serving.map((s) => (s.windowId === windowId ? { ...s, ...windows[0] } : s));
      const hasWindow = q.serving.some((s) => s.windowId === windowId);
      const newServing = hasWindow ? serving : [...q.serving, ...windows];
      const next = {
        ...prev,
        queues: { ...prev.queues, [serviceId]: { ...q, serving: newServing, waiting } },
      };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const completeAndCallNext = useCallback((serviceId, windowId) => {
    setState((prev) => {
      const q = prev.queues[serviceId];
      if (!q) return prev;
      const nextInLine = q.waiting[0];
      const serving = q.serving.filter((s) => s.windowId !== windowId);
      if (nextInLine) {
        const newWaiting = q.waiting.slice(1).map((w, i) => ({ ...w, pos: i + 1 }));
        serving.push({
          windowId,
          windowName: `Window #${windowId}`,
          queueNum: nextInLine.num,
          staff: 'Staff',
          student: `${nextInLine.student} (${nextInLine.id})`,
        });
        const next = {
          ...prev,
          queues: {
            ...prev.queues,
            [serviceId]: { ...q, serving, waiting: newWaiting },
          },
        };
        saveToStorage(next);
        return next;
      }
      const next = { ...prev, queues: { ...prev.queues, [serviceId]: { ...q, serving } } };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const setPaused = useCallback((serviceId, paused) => {
    setState((prev) => {
      const next = {
        ...prev,
        queues: {
          ...prev.queues,
          [serviceId]: { ...prev.queues[serviceId], paused },
        },
      };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const transferStudent = useCallback((fromServiceId, queueNum, toServiceId, student) => {
    removeFromQueue(fromServiceId, queueNum);
    addToQueue(toServiceId, student);
  }, [removeFromQueue, addToQueue]);

  const getActiveQueueForStudent = useCallback((studentId) => {
    for (const [sid, q] of Object.entries(state.queues)) {
      const inWaiting = q.waiting.find((w) => w.id === studentId);
      if (inWaiting) return { serviceId: sid, ...inWaiting };
      const inServing = q.serving.find((s) => s.student?.includes(studentId));
      if (inServing) return { serviceId: sid, num: inServing.queueNum, student: inServing.student, id: studentId };
    }
    return null;
  }, [state.queues]);

  const value = {
    state,
    getServices,
    getService,
    getQueue,
    updateServiceStatus,
    addToQueue,
    removeFromQueue,
    callToWindow,
    completeAndCallNext,
    setPaused,
    transferStudent,
    getActiveQueueForStudent,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}
