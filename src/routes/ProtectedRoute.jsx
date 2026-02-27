import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth || auth.type !== 'staff') {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  const roles = ['Window Operator', 'Registrar Staff', 'Administrator'];
  const userRoleLevel = roles.indexOf(auth.role);
  const requiredLevel = roles.indexOf(requiredRole);

  if (userRoleLevel < requiredLevel) {
    if (auth.role === 'Window Operator') return <Navigate to="/staff/operators" replace />;
    if (auth.role === 'Registrar Staff') return <Navigate to="/staff/queues" replace />;
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
}
