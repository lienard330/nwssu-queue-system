import { useState } from 'react';
import Modal from '../common/Modal';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';

export default function CreateWalkInModal({ serviceId, onClose, onCreated }) {
  const [studentId, setStudentId] = useState('');
  const [adminOverride, setAdminOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const queueApi = useQueueApi();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      toast.warning('Required', 'Enter Student ID');
      return;
    }
    setLoading(true);
    try {
      await queueApi.createWalkIn(studentId.trim(), serviceId, null, adminOverride);
      onCreated();
    } catch (e) {
      toast.error('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Walk-In" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. 2023-12345"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <input type="checkbox" checked={adminOverride} onChange={(e) => setAdminOverride(e.target.checked)} />
          Admin override (bypass daily limit)
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">
            Add Walk-In
          </button>
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
