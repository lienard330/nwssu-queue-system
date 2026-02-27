import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users2, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { studentsServedByDay, peakHours, avgWaitByService, summaryStats } from '../../data/mockReports';
import { useToast } from '../../context/ToastContext';

const chartData = Object.entries(studentsServedByDay).map(([day, count]) => ({ day, students: count }));

export default function ReportsAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('Last 7 Days');

  const handleExport = () => {
    toast.info('Exporting...', 'Demo mode — no file generated');
  };

  const maxPeak = Math.max(...Object.values(peakHours));
  const maxWait = Math.max(...Object.values(avgWaitByService));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500">Queue performance insights</p>
      </div>

      <div className="p-4 rounded-xl bg-white shadow-sm mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Apply</button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white shadow-sm mb-4">
        <h3 className="font-semibold text-gray-900 mb-4">Students Served by Day</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 80]} />
            <Tooltip formatter={(v) => [`${v} students`, 'Students']} />
            <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-5 rounded-xl bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {Object.entries(peakHours).map(([hour, count]) => (
              <div key={hour} className={`flex items-center gap-3 ${count === maxPeak ? 'bg-blue-50 -mx-2 px-2 py-1 rounded' : ''}`}>
                <span className="w-20 text-sm">{hour}</span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(count / maxPeak) * 100}%` }} />
                </div>
                <span className="w-8 text-sm font-medium">{count}</span>
                {count === maxPeak && <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-800 text-xs font-medium">PEAK</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Average Wait by Service</h3>
          <div className="space-y-3">
            {Object.entries(avgWaitByService).map(([svc, mins]) => (
              <div key={svc} className="flex items-center gap-3">
                <span className="w-24 text-sm">{svc}</span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(mins / maxWait) * 100}%` }} />
                </div>
                <span className="w-16 text-sm font-medium text-blue-600 text-right">{mins} mins</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-blue-50">
          <Users2 className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-600">{summaryStats.totalServed}</p>
          <p className="text-sm text-gray-600">Total Students Served</p>
        </div>
        <div className="p-4 rounded-xl bg-green-50">
          <Clock className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-600">{summaryStats.avgWaitTime} min</p>
          <p className="text-sm text-gray-600">Avg Wait Time</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50">
          <CheckCircle className="w-6 h-6 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-amber-600">{summaryStats.completionRate}%</p>
          <p className="text-sm text-gray-600">Completion Rate</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50">
          <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-purple-600">{summaryStats.busiestHour}</p>
          <p className="text-sm text-gray-600">Busiest Hour</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-white shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Export Report</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
            📄 Export as PDF
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            ⬇ Export as CSV
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            🖨 Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
