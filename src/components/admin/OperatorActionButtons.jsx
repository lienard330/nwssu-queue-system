import { Check, RotateCcw, XCircle, PauseCircle } from 'lucide-react';

export default function OperatorActionButtons({ onComplete, onRecall, onNoShow, onBreak }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
      <button onClick={onComplete} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700">
        <Check className="w-5 h-5" /> Complete & Call Next
      </button>
      <button onClick={onRecall} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-500 text-white hover:bg-amber-600">
        <RotateCcw className="w-5 h-5" /> Recall
      </button>
      <button onClick={onNoShow} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 text-white hover:bg-red-700">
        <XCircle className="w-5 h-5" /> No-Show
      </button>
      <button onClick={onBreak} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/90 text-gray-700 border border-gray-200 hover:bg-white">
        <PauseCircle className="w-5 h-5" /> Break
      </button>
    </div>
  );
}
