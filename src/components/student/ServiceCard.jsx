import { Clock, Monitor, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const serviceColors = { EN: 'bg-blue-500', CL: 'bg-green-500', TR: 'bg-purple-500', IP: 'bg-gray-500' };

export default function ServiceCard({ service, onClick, disabled }) {
  const dotColor = serviceColors[service.id] || 'bg-gray-500';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 mx-4 mb-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className="font-semibold text-gray-900">{service.name}</span>
          <StatusBadge status={service.status} showDot />
        </div>
        <p className="text-sm text-gray-500 mb-2">{service.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> ~{service.avgTime} min
          </span>
          <span className="flex items-center gap-1">
            <Monitor className="w-4 h-4" /> {service.windowsActive}/{service.windowsTotal} windows
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  );
}
