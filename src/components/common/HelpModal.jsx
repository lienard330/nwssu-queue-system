import { X } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-md w-full rounded-xl shadow-xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-4">How to Use NWSSU Queue System</h3>
        <p className="text-sm font-semibold text-gray-700 mb-2">Steps for Students:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Login with your Student ID number</li>
          <li>Select the registrar service you need</li>
          <li>Get your queue number automatically</li>
          <li>Track your position from anywhere</li>
          <li>Present QR code when called to a window</li>
        </ol>
      </div>
    </div>
  );
}
