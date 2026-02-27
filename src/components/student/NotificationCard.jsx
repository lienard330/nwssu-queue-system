import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import Badge from '../common/Badge';

const icons = { position: Bell, complete: CheckCircle, warning: AlertTriangle, cancel: XCircle, system: Info };
const iconBg = {
  position: 'bg-blue-100',
  complete: 'bg-green-100',
  warning: 'bg-amber-100',
  cancel: 'bg-red-100',
  system: 'bg-gray-100',
};
const serviceColors = { Enrollment: 'blue', Clearance: 'green', Transcript: 'purple', System: 'gray' };

export default function NotificationCard({ notification }) {
  const Icon = icons[notification.type] || Info;
  const bg = iconBg[notification.type] || 'bg-gray-100';
  const serviceColor = serviceColors[notification.service] || 'gray';

  return (
    <div
      className={`p-4 rounded-xl shadow-sm flex gap-4 ${
        notification.read ? 'bg-slate-50' : 'bg-white border-l-4 border-blue-500'
      }`}
    >
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notification.message}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={serviceColor}>{notification.service}</Badge>
          <span className="text-xs text-gray-400">{notification.time}</span>
        </div>
      </div>
      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 self-center" />}
    </div>
  );
}
