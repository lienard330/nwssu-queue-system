import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCard from '../../components/student/NotificationCard';
import NotificationFilterTabs from '../../components/student/NotificationFilterTabs';
import EmptyState from '../../components/common/EmptyState';

export default function StudentNotifications() {
  const { notifications, markAllRead, unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'queue') return ['position', 'complete', 'warning'].includes(n.type);
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  return (
    <div className="px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/student/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" /> Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 ? (
          <button onClick={markAllRead} className="text-sm text-blue-600 font-medium hover:underline">
            Mark all as read
          </button>
        ) : (
          <div className="w-24" />
        )}
      </div>

      <NotificationFilterTabs activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState title="No notifications here" subtitle="You're all caught up!" />
        ) : (
          filtered.map((n) => <NotificationCard key={n.id} notification={n} />)
        )}
      </div>
    </div>
  );
}
