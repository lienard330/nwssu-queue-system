import { Link } from 'react-router-dom';
import { Info, ChevronRight } from 'lucide-react';

export default function ActiveQueueBanner({ serviceId, queueNum }) {
  return (
    <Link
      to={`/student/queue/${serviceId}`}
      className="flex items-center gap-3 p-4 mx-4 mb-4 rounded-xl bg-info-bg border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium text-gray-800">You have an active queue. Tap to view your position.</p>
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </Link>
  );
}
