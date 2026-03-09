import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';
import NowServingPanel from '../../components/admin/NowServingPanel';
import WaitingListTable from '../../components/admin/WaitingListTable';
import EmergencyPauseBanner from '../../components/admin/EmergencyPauseBanner';
import ConfirmModal from '../../components/common/ConfirmModal';
import CreateWalkInModal from '../../components/admin/CreateWalkInModal';
import PriorityRequestsBanner from '../../components/admin/PriorityRequestsBanner';

export default function QueueDetail() {
  const { serviceId } = useParams();
  const { auth } = useAuth();
  const { getService, getQueue, setPaused } = useQueue();
  const queueApi = useQueueApi();
  const { toast } = useToast();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [paused, setPausedLocal] = useState(false);
  const [apiMode, setApiMode] = useState(false);
  const [apiWaiting, setApiWaiting] = useState([]);
  const [apiServing, setApiServing] = useState([]);

  const service = getService(serviceId);
  const queue = getQueue(serviceId);

  const refreshApiData = useCallback(async () => {
    try {
      const rows = await queueApi.getWaitingList(serviceId);
      setApiWaiting(rows.filter((r) => r.status === 'WAITING'));
      setApiServing(rows.filter((r) => ['CALLED', 'IN_SERVICE'].includes(r.status)));
    } catch (e) {}
  }, [serviceId, queueApi]);

  useEffect(() => {
    (async () => {
      const ok = await queueApi.checkBackend();
      setApiMode(ok);
      if (ok) await refreshApiData();
    })();
  }, [serviceId]);

  const serving = apiMode
    ? apiServing.map((s) => ({ ...s, queueNum: s.num || s.queue_number, id: s.id }))
    : (queue.serving || []).map((s) => ({ ...s, queueNum: s.queueNum || s.queue_number }));
  const waiting = apiMode ? apiWaiting : (queue.waiting || []);
  const servingWithNext = serving.map((s) => ({
    ...s,
    windowId: s.window_id || s.windowId,
    windowName: s.windowName || `Window #${s.window_id || s.windowId || 1}`,
    nextInLine: waiting[0]?.num || waiting[0]?.queue_number,
  }));

  const handleCallNext = async () => {
    if (!apiMode) return;
    try {
      const res = await queueApi.callNext(serviceId, 1, auth?.user?.username);
      if (res.ticket) {
        toast.success('Student Called', `${res.ticket.queue_number} called to window`);
      } else {
        toast.info('Queue Empty', 'No one waiting');
      }
      await refreshApiData();
    } catch (e) {
      toast.error('Error', e.message);
    }
  };

  const handleMarkNoShow = async (row) => {
    if (!apiMode) return;
    try {
      const res = await queueApi.markNoShow(row.id, auth?.user?.username);
      if (res.recalled) {
        toast.info('Recall', `${row.num} moved back to queue (1 recall used)`);
      } else {
        toast.warning('No-Show', `${row.num} marked as No-Show`);
      }
      await refreshApiData();
    } catch (e) {
      toast.error('Error', e.message);
    }
  };

  const handleTransfer = async (row, toServiceId) => {
    if (!apiMode) return;
    try {
      await queueApi.transferTicket(row.id, toServiceId, auth?.user?.username);
      toast.success('Transferred', `Ticket transferred to ${toServiceId}`);
      await refreshApiData();
    } catch (e) {
      toast.error('Error', e.message);
    }
  };

  const handleWalkInCreated = async () => {
    setShowWalkIn(false);
    await refreshApiData();
    toast.success('Walk-In Added', 'Student added to queue');
  };

  const handleCompleteServing = async (s) => {
    if (!apiMode || !s.id) return;
    try {
      await queueApi.completeTicket(s.id, auth?.user?.username);
      toast.success('Completed', `${s.queueNum} marked complete`);
      await refreshApiData();
    } catch (e) {
      toast.error('Error', e.message);
    }
  };

  const handleNoShowServing = async (s) => {
    if (!apiMode || !s.id) return;
    try {
      const res = await queueApi.markNoShow(s.id, auth?.user?.username);
      if (res.recalled) toast.info('Recall', `${s.queueNum} moved back to queue`);
      else toast.warning('No-Show', `${s.queueNum} marked No-Show`);
      await refreshApiData();
    } catch (e) {
      toast.error('Error', e.message);
    }
  };

  if (!service) return null;

  const handleCloseQueue = () => {
    setShowCloseConfirm(false);
    toast.warning('Queue Closed', `${service.name} queue closed`);
  };

  const handleResume = () => {
    setPausedLocal(false);
    setPaused(serviceId, false);
    toast.success('Queue Resumed', `${service.name} queue resumed`);
  };

  const handlePause = () => {
    setPausedLocal(true);
    setPaused(serviceId, true);
    toast.warning('Queue Paused', `${service.name} queue paused`);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link to="/staff/queues" className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-2">← Back</Link>
          <h1 className="text-xl font-bold text-gray-900">{service.name} Queue</h1>
          <p className="text-sm text-gray-500">Current wait time: 5 mins | Active windows: {service.windowsActive}/{service.windowsTotal}</p>
        </div>
        <div className="flex gap-2">
          {apiMode && (
            <>
              <button onClick={handleCallNext} className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">
                Call Next
              </button>
              <button onClick={() => setShowWalkIn(true)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Add Walk-In
              </button>
            </>
          )}
          <button onClick={() => setShowCloseConfirm(true)} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
            Close Queue
          </button>
          <div className="relative">
            <button onClick={() => setShowSettings(!showSettings)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              Settings
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-1 py-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10 min-w-[200px]">
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">⏸ Emergency Pause Queue</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">⚙️ Queue Settings</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">📤 Export Waiting List</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {paused && <EmergencyPauseBanner onResume={handleResume} />}
      {apiMode && <PriorityRequestsBanner />}

      {serving.length > 0 && (
        <div className="mb-4">
          <NowServingPanel
            serving={servingWithNext}
            onComplete={apiMode ? handleCompleteServing : undefined}
            onMarkNoShow={apiMode ? handleNoShowServing : undefined}
          />
        </div>
      )}

      <WaitingListTable
        waiting={waiting}
        serviceId={serviceId}
        serviceName={service.name}
        onCall={apiMode ? handleCallNext : undefined}
        onMarkNoShow={apiMode ? handleMarkNoShow : undefined}
        onTransfer={apiMode ? handleTransfer : undefined}
      />

      {showWalkIn && (
        <CreateWalkInModal
          serviceId={serviceId}
          onClose={() => setShowWalkIn(false)}
          onCreated={handleWalkInCreated}
        />
      )}
      {showCloseConfirm && (
        <ConfirmModal
          title={`Close ${service.name} queue?`}
          message="Students will be notified."
          confirmText="Close Queue"
          cancelText="Cancel"
          onConfirm={handleCloseQueue}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}
    </div>
  );
}
