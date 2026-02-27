import { useState } from 'react';

const actionColors = {
  'Queue Created': 'bg-blue-100 text-blue-800',
  'Queue Called': 'bg-amber-100 text-amber-800',
  'Queue Completed': 'bg-green-100 text-green-800',
  'No-Show': 'bg-red-100 text-red-800',
  'Cancelled': 'bg-orange-100 text-orange-800',
  'Login': 'bg-gray-100 text-gray-700',
  'Logout': 'bg-gray-100 text-gray-700',
  'Service Open': 'bg-teal-100 text-teal-800',
  'Service Close': 'bg-purple-100 text-purple-800',
  'Settings Changed': 'bg-indigo-100 text-indigo-800',
  'Window Change': 'bg-cyan-100 text-cyan-800',
};

export default function LogsTable({ logs }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <>
                <tr
                  key={log.id}
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{log.time}</td>
                  <td className="px-4 py-3 font-medium">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{log.service}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ip}</td>
                </tr>
                {expanded === log.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="space-y-2 text-sm">
                        <p><strong>Full Details</strong></p>
                        <p>Timestamp: {log.time}</p>
                        <p>User: {log.user}</p>
                        <p>Action: {log.action}</p>
                        <p>Details: {log.details}</p>
                        <p>Service: {log.service}</p>
                        <p>IP: {log.ip}</p>
                        <p className="text-gray-500">Session ID: abc-xyz-123 | Browser: Chrome 121 on Windows 11</p>
                        <button onClick={(e) => { e.stopPropagation(); setExpanded(null); }} className="text-blue-600 hover:underline">Close ↑</button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
