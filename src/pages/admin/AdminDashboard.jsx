import { Users2, Activity, Clock, CheckCircle, MonitorSpeaker, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useQueue } from '../../context/QueueContext';
import { getGreeting } from '../../utils/timeHelpers';
import StatCard from '../../components/admin/StatCard';
import ServiceOverviewTable from '../../components/admin/ServiceOverviewTable';
import QuickActionCard from '../../components/admin/QuickActionCard';
import CutOffWarningBanner from '../../components/admin/CutOffWarningBanner';

export default function AdminDashboard() {
  const { auth } = useAuth();
  const { settings, cutOffFormatted } = useSettings();
  const { getServices } = useQueue();
  const services = getServices();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-xl font-semibold text-gray-700 mt-1">{getGreeting()}, {auth?.user?.name}!</p>
      <p className="text-sm text-gray-500 mt-1">Today's cut-off: {cutOffFormatted()} • Feb 26, 2026, 12:06 AM</p>

      <div className="mt-4">
        <CutOffWarningBanner cutOffTime={cutOffFormatted()} onExtend={() => {}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard icon={Users2} label="Total Students" value="4" subLabel="waiting" color="blue" />
        <StatCard icon={Activity} label="Active Queues" value="3" subLabel="being served" color="green" />
        <StatCard icon={Clock} label="Avg Wait Time" value="12" subLabel="minutes" color="yellow" />
        <StatCard icon={CheckCircle} label="Served Today" value="156" subLabel="students" color="purple" />
      </div>

      <div className="mt-6">
        <ServiceOverviewTable services={services} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <QuickActionCard icon={MonitorSpeaker} title="Window Management" description="Assign windows and manage staff" to="/staff/windows" buttonText="Go to Windows" />
        <QuickActionCard icon={BarChart2} title="Reports & Analytics" description="View performance metrics" to="/staff/reports" buttonText="View Reports" />
        <QuickActionCard icon={Settings} title="System Settings" description="Configure queue parameters" to="/staff/settings" buttonText="Settings" />
      </div>
    </div>
  );
}
