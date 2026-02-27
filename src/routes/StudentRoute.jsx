import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentRoute({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth || auth.type !== 'student') {
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  return children;
}
