import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function StaffProfile() {
  const { auth } = useAuth();
  const staff = auth?.user;

  if (!staff) return null;

  const accessLabel =
    staff.access === 'full' ? 'Full system access' : staff.access === 'limited' ? 'Limited registrar access' : 'Window operator access';

  const accessColor =
    staff.access === 'full' ? 'bg-green-100 text-green-700' : staff.access === 'limited' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Profile</h1>

      <div className="p-6 rounded-xl bg-white shadow-sm flex items-center gap-6">
        <Avatar name={staff.name} size="xl" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{staff.name}</h2>
          <p className="mt-1 text-sm text-gray-600">Username: {staff.username}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{staff.role}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${accessColor}`}>{accessLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact & Security</h3>
          <p className="text-sm text-gray-600">
            For account changes or password reset, please contact the Registrar IT support desk. All staff actions in the system are logged for
            auditing.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Role Overview</h3>
          <p className="text-sm text-gray-600">
            Your current role determines which queues, windows, and reports you can access. Use this profile view to verify you are logged in with the
            correct permissions.
          </p>
        </div>
      </div>
    </div>
  );
}

