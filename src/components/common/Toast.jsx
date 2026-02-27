import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-l-green-500 text-green-600',
  error: 'border-l-red-500 text-red-600',
  warning: 'border-l-amber-500 text-amber-600',
  info: 'border-l-blue-500 text-blue-600',
};

export default function Toast({ id, type, title, message, onDismiss }) {
  const Icon = icons[type] || Info;
  return (
    <div className={`flex items-center gap-3 min-w-72 p-4 bg-white rounded-xl shadow-lg border-l-4 ${styles[type]} transition-all duration-200`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm text-gray-900">{title}</p>}
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
      <button onClick={() => onDismiss(id)} className="p-1 rounded hover:bg-gray-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
