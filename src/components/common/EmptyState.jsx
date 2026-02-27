import { Bell } from 'lucide-react';

export default function EmptyState({ icon: Icon = Bell, title = 'No items', subtitle = '', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <Icon className="w-16 h-16 text-gray-400 mb-4" />
      <p className="font-semibold text-gray-700">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
