import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopBar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/staff/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{auth?.user?.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{auth?.role}</span>
        </div>
        <Avatar name={auth?.user?.name} size="sm" />
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium" title="Logout">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}
