import { Outlet } from 'react-router-dom';
import StudentTopBar from './StudentTopBar';

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-admin-body">
      <StudentTopBar />
      <main className="pt-16 pb-8">{<Outlet />}</main>
    </div>
  );
}
