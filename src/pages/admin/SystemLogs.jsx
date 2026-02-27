import { useState, useEffect } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import { mockLogs } from '../../data/mockLogs';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';
import LogsFilterBar from '../../components/admin/LogsFilterBar';
import LogsTable from '../../components/admin/LogsTable';
import Pagination from '../../components/common/Pagination';

export default function SystemLogs() {
  const { toast } = useToast();
  const queueApi = useQueueApi();
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState(mockLogs);
  const [apiMode, setApiMode] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await queueApi.checkBackend();
      setApiMode(ok);
      if (ok) {
        try {
          const rows = await queueApi.getAuditLogs(200);
          setLogs(rows.map((r) => ({
            id: r.id,
            time: new Date(r.created_at).toLocaleString(),
            user: r.staff_id || 'system',
            action: r.action.replace(/_/g, ' '),
            details: r.details ? (typeof r.details === 'string' ? r.details : JSON.stringify(r.details)) : `Ticket #${r.ticket_id || '—'}`,
            service: '—',
            ip: '—',
          })));
        } catch (e) {
          setLogs(mockLogs);
        }
      }
    })();
  }, []);

  const handleExport = () => {
    toast.info('Exporting...', 'Exporting CSV... (Demo)');
  };

  const pageSize = 20;
  const totalPages = Math.ceil(logs.length / pageSize) || 1;
  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" /> System Logs & Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-1">Complete record of all system activity</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <span className="px-3 py-1 rounded-full border border-gray-200 text-sm">🔵 Total Logs: {logs.length}</span>
        {apiMode && <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Backend Connected</span>}
      </div>

      <div className="mb-4">
        <LogsFilterBar />
      </div>

      <LogsTable logs={paginatedLogs} />

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, logs.length)} of {logs.length} logs</p>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
