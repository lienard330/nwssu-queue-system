import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CutOffWarningBanner({ cutOffTime, onExtend }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Cut-off time approaching at {cutOffTime}. Queue will freeze in 30 minutes.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onExtend} className="px-3 py-1 rounded-lg border border-amber-600 text-amber-800 text-sm font-medium hover:bg-amber-100">
          Extend Cut-Off
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 rounded hover:bg-amber-100">
          <span className="text-amber-800">✕</span>
        </button>
      </div>
    </div>
  );
}
