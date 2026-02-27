import { Pencil, Pause, Play } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function WindowCard({ window: w, onEdit, onPause, onActivate }) {
  const isActive = w.status === 'Active';
  const isOnBreak = w.status === 'OnBreak';
  const isInactive = w.status === 'Inactive';

  const bgClass = isActive ? 'bg-green-50 border-green-200' : isOnBreak ? 'bg-amber-50 border-amber-200' : 'bg-white border-dashed border-gray-300';
  const statusLabel = isActive ? '● Active' : isOnBreak ? '⏸ On Break' : '○ Inactive';

  return (
    <div className={`p-5 rounded-xl border ${bgClass}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-gray-900">{w.name}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={w.status} showDot={false} />
          <button onClick={() => onEdit?.(w)} className="p-1 rounded hover:bg-gray-200">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600"><span className="text-gray-500">Assigned To:</span> <span className={w.staff === 'Unassigned' ? 'italic text-gray-400' : 'font-semibold'}>{w.staff}</span></p>
      <p className="text-sm text-gray-600 mt-1"><span className="text-gray-500">Service:</span> {w.service}</p>
      <p className="text-sm text-gray-600 mt-1"><span className="text-gray-500">Currently Serving:</span> <span className="font-semibold text-blue-600">{w.serving || '—'}</span></p>
      <div className="mt-4">
        {isActive ? (
          <button onClick={() => onPause?.(w)} className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button onClick={() => onActivate?.(w)} className="w-full py-2 rounded-lg bg-gray-900 text-white flex items-center justify-center gap-2 hover:bg-gray-800">
            <Play className="w-4 h-4" /> Activate
          </button>
        )}
      </div>
    </div>
  );
}
