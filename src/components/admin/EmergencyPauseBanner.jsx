export default function EmergencyPauseBanner({ onResume }) {
  return (
    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-red-600 font-bold">⚠️</span>
        <p className="text-sm text-red-800 font-medium">Queue Paused — No students are being called</p>
      </div>
      <button onClick={onResume} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">
        Resume Queue
      </button>
    </div>
  );
}
