import { Phone, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import StudentDetailModal from './StudentDetailModal';
import TransferServiceModal from './TransferServiceModal';

export default function WaitingListTable({ waiting, serviceId, serviceName, onCall, onMarkNoShow, onTransfer }) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [detailOpen, setDetailOpen] = useState(null);
  const [transferRow, setTransferRow] = useState(null);

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Waiting List ({waiting.length} students)</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">↻ Refresh</button>
          <button className="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Export</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Queue #</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Wait Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {waiting.map((row) => (
              <tr key={row.num} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">{row.pos}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setDetailOpen(row)} className="text-blue-600 font-medium hover:underline">
                    {row.num}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{row.student}</p>
                  <p className="text-xs text-gray-500">{row.id}</p>
                </td>
                <td className="px-4 py-3">{row.course}</td>
                <td className="px-4 py-3">{row.waitTime} min</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {onCall && (
                      <button
                        onClick={() => onCall(row)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </button>
                    )}
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === row.num ? null : row.num)} className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === row.num && (
                        <div className="absolute right-0 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[160px]">
                          {onMarkNoShow && (
                            <button onClick={() => { onMarkNoShow(row); setMenuOpen(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Mark No-Show</button>
                          )}
                          {onTransfer && (
                            <button onClick={() => { setTransferRow(row); setMenuOpen(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Transfer to Service</button>
                          )}
                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cancel Queue</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detailOpen && (
        <StudentDetailModal
          student={detailOpen}
          serviceName={serviceName}
          onClose={() => setDetailOpen(null)}
          onCall={() => onCall?.(detailOpen)}
        />
      )}
      {transferRow && onTransfer && (
        <TransferServiceModal
          student={transferRow}
          fromService={serviceId}
          onClose={() => setTransferRow(null)}
          onTransfer={(toServiceId) => {
            onTransfer(transferRow, toServiceId);
            setTransferRow(null);
          }}
        />
      )}
    </div>
  );
}
