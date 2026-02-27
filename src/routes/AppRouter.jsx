import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/public/Landing';
import QueueDisplay from '../pages/public/QueueDisplay';
import StudentLogin from '../pages/student/StudentLogin';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentQueueStatus from '../pages/student/StudentQueueStatus';
import StudentNotifications from '../pages/student/StudentNotifications';
import StudentProfile from '../pages/student/StudentProfile';
import StudentPriorityQueue from '../pages/student/StudentPriorityQueue';
import StaffLogin from '../pages/admin/StaffLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import QueueManagement from '../pages/admin/QueueManagement';
import QueueDetail from '../pages/admin/QueueDetail';
import WindowManagement from '../pages/admin/WindowManagement';
import ReportsAnalytics from '../pages/admin/ReportsAnalytics';
import SystemLogs from '../pages/admin/SystemLogs';
import SystemSettings from '../pages/admin/SystemSettings';
import OperatorView from '../pages/admin/OperatorView';
import StudentLayout from '../components/layout/StudentLayout';
import AdminLayout from '../components/layout/AdminLayout';
import StudentRoute from './StudentRoute';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/display/:serviceId" element={<QueueDisplay />} />

        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/*"
          element={
            <StudentRoute>
              <StudentLayout />
            </StudentRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="queue/:serviceId" element={<StudentQueueStatus />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="priority-queue" element={<StudentPriorityQueue />} />
        </Route>

        <Route path="/staff/login" element={<StaffLogin />} />
        <Route
          path="/staff/operators"
          element={
            <ProtectedRoute requiredRole="Window Operator">
              <OperatorView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute requiredRole="Registrar Staff">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="queues" element={<QueueManagement />} />
          <Route path="queues/:serviceId" element={<QueueDetail />} />
          <Route path="windows" element={<WindowManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="logs" element={<SystemLogs />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
