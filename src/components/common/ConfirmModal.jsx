import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, variant = 'danger' }) {
  const confirmClass = variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white';
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white max-w-md w-full rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-center text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 text-center mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onConfirm} className={`flex-1 py-2 px-4 rounded-lg font-medium ${confirmClass}`}>
            {confirmText}
          </button>
          <button onClick={onCancel} className="flex-1 py-2 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
