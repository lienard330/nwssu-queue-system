import { useState } from 'react';
import Modal from '../common/Modal';

export default function EditWindowModal({ window: w, onClose, onSave, isAdd = false }) {
  const [name, setName] = useState(w?.name || '');
  const [staff, setStaff] = useState(w?.staff || 'Unassigned');
  const [service, setService] = useState(w?.service || 'Enrollment');
  const [status, setStatus] = useState(w?.status || 'Active');

  const handleSave = () => {
    onSave?.({ ...w, name, staff, service, status });
    onClose();
  };

  return (
    <Modal title={isAdd ? 'Add Window' : `Edit ${w?.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Window Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="Window #1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Staff</label>
          <select value={staff} onChange={(e) => setStaff(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300">
            <option>A. Cruz</option>
            <option>M. Lopez</option>
            <option>R. Santos</option>
            <option>Unassigned</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Service</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300">
            <option>Enrollment</option>
            <option>Clearance</option>
            <option>Transcript</option>
            <option>INC</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="flex gap-4">
            {['Active', 'On Break', 'Inactive'].map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="radio" name="status" checked={status === s} onChange={() => setStatus(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Save Changes</button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
