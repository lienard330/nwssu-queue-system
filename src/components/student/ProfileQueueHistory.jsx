import { mockQueueHistory } from '../../data/mockQueues';
import Badge from '../common/Badge';

const statusVariants = { 'In Queue': 'warning', Completed: 'success', 'No-Show': 'danger', Cancelled: 'warning' };

export default function ProfileQueueHistory() {
  return (
    <div className="mx-4 mt-4 p-4 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Queue History</h3>
        <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs">Last 30 days</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Service</th>
              <th className="pb-2 pr-4">Queue #</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Wait Time</th>
            </tr>
          </thead>
          <tbody>
            {mockQueueHistory.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 pr-4">{row.date}</td>
                <td className="py-3 pr-4">{row.service}</td>
                <td className="py-3 pr-4 font-medium">{row.queueNum}</td>
                <td className="py-3 pr-4">
                  <Badge variant={statusVariants[row.status] || 'gray'}>{row.status}</Badge>
                </td>
                <td className="py-3">{row.waitTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Showing 7 of 7 transactions</p>
    </div>
  );
}
