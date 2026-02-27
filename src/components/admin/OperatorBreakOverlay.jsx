import { PauseCircle } from 'lucide-react';

export default function OperatorBreakOverlay({ windowName, onResume }) {
  return (
    <div className="absolute inset-0 bg-amber-100 flex flex-col items-center justify-center p-8">
      <PauseCircle className="w-16 h-16 text-amber-600 mb-4" />
      <p className="text-2xl font-bold text-amber-900">{windowName} is on Break</p>
      <p className="text-sm text-amber-700 mt-1">No students are being called</p>
      <button onClick={onResume} className="mt-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">
        ▷ Resume Window
      </button>
    </div>
  );
}
