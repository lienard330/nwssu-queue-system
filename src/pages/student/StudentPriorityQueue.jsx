import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/student/QRCodeModal';
import PriorityQueueSteps from '../../components/student/PriorityQueueSteps';

export default function StudentPriorityQueue() {
  const { auth } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const student = auth?.user;

  const qrData = {
    queueNumber: 'EN-P003',
    studentId: student?.id,
    name: student?.name,
    service: 'Enrollment',
    timestamp: new Date().toISOString(),
    priority: true,
  };

  return (
    <div className="px-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/student/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Priority Queue</h1>
      </div>

      <div className="mx-4 mt-4 p-6 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-600 text-white text-center">
        <span className="text-5xl animate-bounce inline-block">⭐</span>
        <h2 className="text-xl font-bold mt-2">Priority Queue Assigned</h2>
        <p className="text-sm text-white/80 mt-1">You are guaranteed a spot at the front of the line</p>
      </div>

      <div className="mx-4 mt-4 p-6 rounded-xl bg-white shadow-md">
        <p className="text-sm text-gray-500">Priority Queue Number</p>
        <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          <p className="text-4xl font-bold text-white">⭐ EN-P003</p>
          <p className="text-sm text-white/80">Priority Enrollment Queue</p>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Student:</span><span className="font-semibold">{student?.name} ({student?.id})</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Service:</span><span className="font-semibold">Enrollment</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Assigned:</span><span className="font-semibold">Feb 26, 2026 at 5:01 PM</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Valid For:</span><span className="font-semibold">Feb 27, 2026 only</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Position:</span><span className="font-semibold">#3 in priority queue</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Est. Start:</span><span className="font-semibold">8:00 AM</span></div>
        </div>
        <button
          onClick={() => setShowQR(true)}
          className="mt-4 w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-blue-50"
        >
          <QrCode className="w-4 h-4" /> Show QR Code
        </button>
      </div>

      <PriorityQueueSteps />

      <div className="mx-4 mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="font-semibold text-amber-800">⚠️ Your priority number is valid for TODAY ONLY</p>
        <p className="text-sm text-amber-700 mt-1">Feb 27, 2026 — Please arrive before the 5:00 PM cut-off or your priority slot will expire.</p>
      </div>

      <Link
        to="/student/dashboard"
        className="block mx-4 mt-6 py-3 rounded-lg bg-blue-600 text-white font-medium text-center hover:bg-blue-700"
      >
        Return to Dashboard
      </Link>

      {showQR && <QRCodeModal onClose={() => setShowQR(false)} data={qrData} />}
    </div>
  );
}
