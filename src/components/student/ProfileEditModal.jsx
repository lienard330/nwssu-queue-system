import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';

export default function ProfileEditModal({ isOpen, onClose, student, onSave }) {
  const [email, setEmail] = useState(student?.email || '');

  const handleSave = () => {
    onSave(email);
    onClose();
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div className="space-y-4">
        <Input label="Full Name" value={student?.name} disabled className="bg-gray-100" title="Contact Registrar's Office to update" />
        <Input label="Student ID" value={student?.id} disabled className="bg-gray-100" />
        <Input label="Program" value={student?.program} disabled className="bg-gray-100" />
        <Input label="Year Level" value={student?.year} disabled className="bg-gray-100" />
        <Input label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <div className="p-3 rounded-lg bg-amber-50 text-xs text-amber-800">
          ⚠️ To update personal information other than email, please visit the Registrar's Office.
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
            Save Changes
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
