const variants = {
  Open: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-600',
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-600',
  OnBreak: 'bg-amber-100 text-amber-800',
};

export default function StatusBadge({ status, showDot = false }) {
  const v = variants[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${v}`}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />}
      {status}
    </span>
  );
}
