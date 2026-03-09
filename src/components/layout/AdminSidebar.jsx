import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, MonitorSpeaker, BarChart2, Shield, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Administrator'] },
  { path: '/staff/queues', icon: ListOrdered, label: 'Queues', roles: ['Administrator', 'Registrar Staff'] },
  { path: '/staff/windows', icon: MonitorSpeaker, label: 'Windows', roles: ['Administrator', 'Registrar Staff'] },
  { path: '/staff/reports', icon: BarChart2, label: 'Reports', roles: ['Administrator'] },
  { path: '/staff/logs', icon: Shield, label: 'Logs', roles: ['Administrator'] },
  { path: '/staff/settings', icon: Settings, label: 'Settings', roles: ['Administrator'] },
];

export default function AdminSidebar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const role = auth?.role;

  const handleLogout = () => {
    logout();
    navigate('/staff/login', { replace: true });
  };
  const visible = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-40 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">N</div>
          <div>
            <p className="font-bold text-gray-900">NWSSU</p>
            <p className="text-xs text-gray-500">Queue System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visible.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <a
          href="/display/EN"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Queue Display</span>
        </a>
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-2 py-3 px-4 w-full rounded-lg text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
