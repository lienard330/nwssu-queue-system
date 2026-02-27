import { useState } from 'react';
import Modal from '../common/Modal';

const SERVICES = [
  { id: 'EN', name: 'Enrollment' },
  { id: 'CL', name: 'Clearance' },
  { id: 'TR', name: 'Transcript Request' },
  { id: 'IP', name: 'INC Process' },
];

export default function TransferServiceModal({ student, fromService, onClose, onTransfer }) {
  const [toServiceId, setToServiceId] = useState('');
  const options = SERVICES.filter((s) => s.id !== fromService);
  const handleTransfer = () => {
    if (toServiceId) {
      onTransfer(toServiceId);
    }
  };
  return (
    <Modal title="Transfer Student" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4">
        Transfer {student?.num || student?.queue_number} ({student?.student}) to another service:
      </p>
      <select
        value={toServiceId}
        onChange={(e) => setToServiceId(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4"
      >
        <option value="">Select service</option>
        {options.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <div className="flex gap-3">
        <button onClick={handleTransfer} disabled={!toServiceId} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">Transfer</button>
        <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
      </div>
    </Modal>
  );
}
