export default function NowServingPanel({ serving, onComplete, onMarkNoShow }) {
  return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
      <p className="text-sm font-semibold text-amber-800 mb-3">● NOW SERVING</p>
      <div className="grid grid-cols-2 gap-3">
        {serving.map((s) => (
          <div key={s.windowId || s.id || s.queueNum} className="p-3 rounded-lg bg-white border-2 border-amber-200">
            <p className="text-xs text-gray-500">{s.windowName || 'Window'}</p>
            <p className="text-2xl font-bold text-blue-600">{s.queueNum}</p>
            {(onComplete || onMarkNoShow) && (
              <div className="flex gap-2 mt-2">
                {onComplete && (
                  <button onClick={() => onComplete(s)} className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">Complete</button>
                )}
                {onMarkNoShow && (
                  <button onClick={() => onMarkNoShow(s)} className="px-2 py-1 text-xs rounded border border-red-600 text-red-600 hover:bg-red-50">No-Show</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-2">Next in line: {serving[0]?.nextInLine || '—'}</p>
    </div>
  );
}
