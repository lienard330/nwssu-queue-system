import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';
import ActiveQueueBanner from '../../components/student/ActiveQueueBanner';
import PriorityQueueBanner from '../../components/student/PriorityQueueBanner';
import ServiceCard from '../../components/student/ServiceCard';
import HowItWorks from '../../components/student/HowItWorks';
import Modal from '../../components/common/Modal';

export default function StudentDashboard() {
  const { auth } = useAuth();
  const { getServices, getActiveQueueForStudent } = useQueue();
  const queueApi = useQueueApi();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [apiActiveTicket, setApiActiveTicket] = useState(null);
  const [apiMode, setApiMode] = useState(false);

  const student = auth?.user;
  const services = getServices();
  useEffect(() => {
    (async () => {
      const ok = await queueApi.checkBackend();
      setApiMode(ok);
      if (ok && student) {
        const t = await queueApi.getActiveTicket(student.id);
        setApiActiveTicket(t);
      }
    })();
  }, [student?.id]);
  const activeQueue = apiMode && student
    ? (apiActiveTicket ? { serviceId: apiActiveTicket.service_id, num: apiActiveTicket.queue_number } : null)
    : (student ? getActiveQueueForStudent(student.id) : null);
  const hasPriorityQueue = localStorage.getItem('priorityQueue') === 'true';

  const handleServiceClick = (service) => {
    if (service.status === 'Closed') {
      toast.warning('Service Closed', 'This service is currently closed.');
      return;
    }
    if (activeQueue) {
      setShowModal({ type: 'active', queueNum: activeQueue.num, targetServiceId: service.id });
      return;
    }
    navigate(`/student/queue/${service.id}`);
  };


  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-[#1E40AF] to-[#6D28D9] rounded-b-3xl px-4 pt-4 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{student?.name}</h1>
            <p className="text-sm text-white/70">{student?.id}</p>
            <div className="mt-3">
              {activeQueue ? (
                <button className="px-3 py-1 rounded-lg bg-green-500/30 text-green-200 text-sm font-medium border border-green-400/50">
                  ● In Queue
                </button>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-white/20 text-white/80 text-sm">○ No Active Queue</span>
              )}
            </div>
          </div>
          <Users className="w-12 h-12 text-white/50" />
        </div>
      </div>

      {activeQueue && <ActiveQueueBanner serviceId={activeQueue.serviceId} queueNum={activeQueue.num} />}
      {hasPriorityQueue && <PriorityQueueBanner />}

      <div className="mt-6">
        <h2 className="text-lg font-semibold px-4 mb-3">Available Services</h2>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onClick={() => handleServiceClick(service)} disabled={service.status === 'Closed'} />
        ))}
      </div>

      <div className="mt-8">
        <HowItWorks />
      </div>

      {showModal?.type === 'active' && (
        <Modal title="Active Queue" onClose={() => setShowModal(null)}>
          <p className="text-sm text-gray-600 mb-4">
            You already have an active queue ({showModal.queueNum}). Cancel it to join a new service.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const target = showModal?.targetServiceId || 'EN';
                setShowModal(null);
                navigate(`/student/queue/${target}`);
              }}
              className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Cancel Existing & Join New
            </button>
            <button onClick={() => setShowModal(null)} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Keep Current Queue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
