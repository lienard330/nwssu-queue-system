import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';
import QueueStatusCard from '../../components/student/QueueStatusCard';
import QRCodeModal from '../../components/student/QRCodeModal';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function StudentQueueStatus() {
  const { serviceId } = useParams();
  const { auth } = useAuth();
  const { getService, addToQueue, removeFromQueue, getActiveQueueForStudent } = useQueue();
  const queueApi = useQueueApi();
  const { toast } = useToast();
  const navigate = useNavigate();

  const service = getService(serviceId);
  const student = auth?.user;

  const [apiMode, setApiMode] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [peopleAhead, setPeopleAhead] = useState(2);
  const [joinedAt, setJoinedAt] = useState(() => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
  const [showQR, setShowQR] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const activeQueue = apiMode ? (ticket ? { num: ticket.queue_number, serviceId, status: ticket.status } : null) : (student ? getActiveQueueForStudent(student.id) : null);
  const queueNum = activeQueue?.num || ticket?.queue_number || `${serviceId}-010`;
  const totalInQueue = 4;
  const estWait = Math.max(0, peopleAhead * 5);
  const isCalled = ticket?.status === 'CALLED';
  const isCarryOver = ticket?.is_carry_over;

  const refreshTicket = useCallback(async () => {
    if (!apiMode || !student) return;
    try {
      const t = await queueApi.getActiveTicket(student.id);
      setTicket(t);
      if (t?.joined_at) setJoinedAt(new Date(t.joined_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    } catch (e) {}
  }, [apiMode, student?.id, queueApi]);

  useEffect(() => {
    (async () => {
      const ok = await queueApi.checkBackend();
      if (ok && student && service?.status === 'Open') {
        setApiMode(true);
        let t = await queueApi.getActiveTicket(student.id);
        if (!t) {
          try {
            const can = await queueApi.canJoin(student.id, serviceId);
            if (!can.canJoin) {
              toast.warning('Active Queue', can.error || 'You already have an active queue.');
              navigate('/student/dashboard');
              return;
            }
            const res = await queueApi.joinQueue(student.id, serviceId);
            t = res.ticket;
            if (res.isCarryOver) toast.info('Carry-Over Ticket', 'You received a carry-over ticket for the next business day.');
          } catch (e) {
            toast.error('Error', e.message || 'Could not join queue.');
            setApiMode(false);
          }
        }
        setTicket(t);
        if (t?.joined_at) setJoinedAt(new Date(t.joined_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      } else if (!ok && !student ? false : !getActiveQueueForStudent(student?.id) && student && service?.status === 'Open') {
        addToQueue(serviceId, student);
      }
    })();
  }, []);

  useEffect(() => {
    if (!apiMode || !ticket) return;
    const iv = setInterval(refreshTicket, 8000);
    return () => clearInterval(iv);
  }, [apiMode, ticket?.id, refreshTicket]);

  useEffect(() => {
    if (!apiMode) {
      const t = setInterval(() => {
        setPeopleAhead((p) => {
          if (p === 1) toast.info("You're Next!", 'Proceed to your window');
          return Math.max(0, p - 1);
        });
      }, 8000);
      return () => clearInterval(t);
    }
  }, [apiMode, toast]);

  const handleConfirmArrival = async () => {
    if (!ticket?.id) return;
    setConfirming(true);
    try {
      await queueApi.confirmArrival(ticket.id);
      await refreshTicket();
      toast.success('Arrival Confirmed', 'Proceed to your window.');
    } catch (e) {
      toast.error('Error', e.message);
    }
    setConfirming(false);
  };

  const handleCancel = () => {
    if (apiMode) {
      toast.info('Cancel', 'Please ask staff to cancel your queue.');
      setShowCancel(false);
      return;
    }
    removeFromQueue(serviceId, queueNum);
    toast.success('Queue Cancelled', 'Your queue has been cancelled.');
    navigate('/student/dashboard');
    setShowCancel(false);
  };

  const qrData = {
    queueNumber: queueNum,
    studentId: student?.id,
    name: student?.name,
    service: service?.name || 'Enrollment',
    timestamp: new Date().toISOString(),
  };

  if (!service) return null;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-[#1E40AF] to-[#6D28D9] rounded-b-3xl px-4 pt-4 pb-8">
        <Link to="/student/dashboard" className="text-white hover:underline flex items-center gap-1 mb-4">
          ← Back to Dashboard
        </Link>
        <p className="text-sm text-white/80 uppercase tracking-wide text-center">{service.name}</p>
        <p className="text-5xl font-bold text-white text-center mt-2">{queueNum}</p>
        <p className="text-sm text-white/70 text-center">Your Queue Number</p>
        {isCarryOver && (
          <p className="mt-2 text-sm text-amber-200 bg-amber-500/30 rounded-lg px-3 py-1 inline-block">Carry-Over Ticket — Prioritized next day</p>
        )}
      </div>

      {isCalled && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-green-100 border border-green-300">
          <p className="font-semibold text-green-800">You&apos;re Being Called!</p>
          <p className="text-sm text-green-700 mt-1">Please confirm arrival and proceed to your window.</p>
          <button onClick={handleConfirmArrival} disabled={confirming} className="mt-3 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50">
            Confirm Arrival
          </button>
        </div>
      )}

      <div className="mt-6">
        <QueueStatusCard
          position={isCalled ? -1 : (ticket?.status === 'IN_SERVICE' ? -2 : peopleAhead)}
          totalInQueue={totalInQueue}
          estWait={estWait}
          joinedAt={joinedAt}
          onShowQR={() => setShowQR(true)}
          onCancel={() => setShowCancel(true)}
        />
      </div>

      {apiMode && ticket?.status === 'WAITING' && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="font-medium text-blue-900 mb-2">Need priority lane?</p>
          <button onClick={() => setShowPriorityModal(true)} className="text-sm text-blue-700 underline hover:no-underline">
            Request Priority (PWD, Pregnant, Medical Emergency)
          </button>
        </div>
      )}
      {showPriorityModal && (
        <Modal title="Request Priority" onClose={() => setShowPriorityModal(false)}>
          <p className="text-sm text-gray-600 mb-3">Select reason for priority request:</p>
          <div className="flex flex-col gap-2">
            {['PWD', 'Pregnant', 'Medical Emergency'].map((r) => (
              <button
                key={r}
                onClick={async () => {
                  try {
                    await queueApi.requestPriority(ticket.id, r);
                    toast.success('Request Sent', 'Registrar will review your priority request.');
                    setShowPriorityModal(false);
                  } catch (e) {
                    toast.error('Error', e.message);
                  }
                }}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-left"
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPriorityModal(false)} className="mt-4 w-full py-2 rounded-lg border border-gray-300 text-gray-700">
            Cancel
          </button>
        </Modal>
      )}

      <div className="mx-4 mt-4 p-4 rounded-xl bg-white shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Important Reminders</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• You'll receive a notification when it's your turn</li>
          <li>• Have your documents ready when called</li>
          <li>• Present your QR code at the window for verification</li>
          <li>• Grace period: 5 minutes after being called</li>
        </ul>
      </div>

      {showQR && <QRCodeModal onClose={() => setShowQR(false)} data={qrData} />}
      {showCancel && (
        <ConfirmModal
          title="Cancel Queue?"
          message={`Are you sure you want to cancel your queue number ${queueNum} for ${service.name}? This action cannot be undone.`}
          confirmText="Cancel Queue"
          cancelText="Keep My Queue"
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}
