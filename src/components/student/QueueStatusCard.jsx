import { Clock, Users, QrCode, X } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

export default function QueueStatusCard({ position, totalInQueue, estWait, joinedAt, onShowQR, onCancel }) {
  const progress = totalInQueue > 0 ? ((totalInQueue - Math.max(0, position)) / totalInQueue) * 100 : 100;
  const isNext = position === 0;
  const isServing = position < 0;

  return (
    <div className="mx-4 p-6 rounded-xl bg-white shadow-md">
      <div className="flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
            isNext ? 'bg-green-500 animate-pulse text-white' : isServing ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {Math.max(0, position)}
        </div>
        <p className={`mt-2 font-semibold ${isNext || isServing ? 'text-green-600' : 'text-gray-600'}`}>
          {isServing ? 'Proceed to Window #2' : isNext ? "You're Next!" : 'In Queue'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {isServing
            ? 'Please proceed immediately — grace period: 5 min'
            : isNext
            ? "Get ready! Proceed to your window."
            : `${position} people ahead of you`}
        </p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Queue Progress</span>
          <span className="font-medium text-gray-800">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-4 h-4" /> Est. Wait Time
          </div>
          <p className="font-bold text-gray-900 mt-1">{estWait} min</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-4 h-4" /> Joined At
          </div>
          <p className="font-bold text-gray-900 mt-1">{joinedAt}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={onShowQR}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <QrCode className="w-4 h-4" /> Show QR
        </button>
        <button onClick={onCancel} className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
