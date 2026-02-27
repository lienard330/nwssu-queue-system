import { Link } from 'react-router-dom';
import { Clock, Users, Monitor } from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { useToast } from '../../context/ToastContext';
import { useState } from 'react';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function QueueManagement() {
  const { getServices, getQueue, updateServiceStatus } = useQueue();
  const { toast } = useToast();
  const [confirmClose, setConfirmClose] = useState(null);
  const services = getServices();

  const handleToggle = (service, checked) => {
    if (!checked) {
      setConfirmClose(service);
    } else {
      updateServiceStatus(service.id, 'Open');
      toast.success('Queue Opened', `${service.name} queue opened`);
    }
  };

  const handleConfirmClose = () => {
    if (confirmClose) {
      updateServiceStatus(confirmClose.id, 'Closed');
      toast.warning('Queue Closed', `${confirmClose.name} queue closed`);
      setConfirmClose(null);
    }
  };

  const getWaitingCount = (id) => {
    const q = getQueue(id);
    return q.waiting?.length ?? 0;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
      <p className="text-sm text-gray-500 mt-1">Monitor and manage all service queues</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {services.map((s) => {
          const waiting = getWaitingCount(s.id);
          const isClosed = s.status === 'Closed';
          return (
            <div key={s.id} className={`p-5 rounded-xl bg-white shadow-sm ${isClosed ? 'opacity-75' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <span className="text-xs text-gray-500">{s.id}</span>
                </div>
                <ToggleSwitch checked={s.status === 'Open'} onChange={(v) => handleToggle(s, v)} />
              </div>
              <p className="text-sm text-gray-500 mb-3">{s.description}</p>
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~{s.avgTime} min avg</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {waiting} waiting</span>
                <span className="flex items-center gap-1"><Monitor className="w-4 h-4" /> {s.windowsActive}/{s.windowsTotal} windows</span>
              </div>
              <Link to={`/staff/queues/${s.id}`} className="block w-full py-2 rounded-lg bg-blue-600 text-white text-center font-medium hover:bg-blue-700">
                Manage Queue
              </Link>
            </div>
          );
        })}
      </div>

      {confirmClose && (
        <ConfirmModal
          title={`Close ${confirmClose.name} queue?`}
          message="Students will be notified."
          confirmText="Close Queue"
          cancelText="Cancel"
          onConfirm={handleConfirmClose}
          onCancel={() => setConfirmClose(null)}
        />
      )}
    </div>
  );
}
