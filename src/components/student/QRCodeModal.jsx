import { QRCodeSVG } from 'qrcode.react';
import Modal from '../common/Modal';

export default function QRCodeModal({ isOpen, onClose, data }) {
  if (!data) return null;
  const qrValue = JSON.stringify(data);
  return (
    <Modal title="Verification QR Code" onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-xl">
          <QRCodeSVG value={qrValue} size={200} level="H" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{data.queueNumber}</p>
          <p className="text-sm text-gray-700">{data.name}</p>
          <p className="text-sm text-gray-500">{data.studentId}</p>
        </div>
        <div className="w-full p-3 rounded-lg bg-info-bg text-center text-sm text-blue-800">
          Present this code at the window for verification
        </div>
      </div>
    </Modal>
  );
}
