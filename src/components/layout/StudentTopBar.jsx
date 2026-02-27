import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function StudentTopBar() {
  const { auth, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link to="/student/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">N</div>
        <span className="font-semibold text-gray-900 hidden sm:inline">NWSSU Queue</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/student/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/student/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer min-h-[40px]">
          <Avatar name={auth?.user?.name || 'Student'} size="sm" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Profile</span>
        </Link>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
