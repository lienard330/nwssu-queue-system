import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

export default function AdminLayout() {
  const { auth, isOperator } = useAuth();

  if (!auth || auth.type !== 'staff') return <Navigate to="/staff/login" replace />;
  if (isOperator) return <Navigate to="/staff/operators" replace />;

  return (
    <div className="min-h-screen bg-admin-body">
      <AdminSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <AdminTopBar />
        <main className="flex-1 p-6 overflow-auto">{<Outlet />}</main>
      </div>
    </div>
  );
}
