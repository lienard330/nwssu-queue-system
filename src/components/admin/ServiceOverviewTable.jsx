import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

export default function ServiceOverviewTable({ services, queueLengths }) {
  const getLength = (id) => {
    const map = { EN: 3, CL: 1, TR: 0, IP: 0 };
    return map[id] ?? 0;
  };
  const getWait = (id) => {
    const map = { EN: 5, CL: 8, TR: 15, IP: 10 };
    return `~${map[id] ?? 0} min`;
  };
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Service Overview</h3>
        <Link to="/staff/queues" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Queue Length</th>
              <th className="px-4 py-3">Wait Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-gray-100 hover:bg-blue-50/50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{getLength(s.id)} students</td>
                <td className="px-4 py-3">{getWait(s.id)}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} showDot /></td>
                <td className="px-4 py-3">
                  <Link to={`/staff/queues/${s.id}`} className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
