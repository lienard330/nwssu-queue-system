import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function PriorityQueueBanner() {
  return (
    <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-yellow-300" />
        <span className="font-bold">You have a Priority Queue for today!</span>
      </div>
      <p className="text-sm text-white/90 mb-3">Priority Number: EN-P003 | Service: Enrollment | Valid: Today only</p>
      <Link
        to="/student/priority-queue"
        className="inline-block px-4 py-2 rounded-lg border-2 border-white text-white font-medium hover:bg-white/20 transition-colors"
      >
        View Priority Queue Details →
      </Link>
    </div>
  );
}
