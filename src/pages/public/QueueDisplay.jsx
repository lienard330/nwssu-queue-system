/**
 * Public queue display - queue numbers only (no full names for privacy)
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, isBackendAvailable } from '../../api/client';

export default function QueueDisplay() {
  const { serviceId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await isBackendAvailable();
      if (ok && serviceId) {
        try {
          const data = await api.queue.waiting(serviceId, true);
          if (mounted) setRows(data);
        } catch (e) {}
      }
      if (mounted) setLoading(false);
    })();
    const iv = setInterval(async () => {
      if (await isBackendAvailable() && serviceId) {
        try {
          const data = await api.queue.waiting(serviceId, true);
          if (mounted) setRows(data);
        } catch (e) {}
      }
    }, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [serviceId]);

  const serving = rows.filter((r) => ['CALLED', 'IN_SERVICE'].includes(r.status));
  const waiting = rows.filter((r) => r.status === 'WAITING');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Queue Display</h1>
      <p className="text-center text-gray-400 text-sm mb-8">Service: {serviceId || 'All'} — Queue numbers only</p>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          {serving.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-green-400 mb-4">NOW SERVING</h2>
              <div className="grid grid-cols-2 gap-4">
                {serving.map((r) => (
                  <div key={r.queue_number} className="p-6 rounded-xl bg-green-900/50 border border-green-600 text-center">
                    <p className="text-4xl font-bold">{r.queue_number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {waiting.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-blue-400 mb-4">WAITING</h2>
              <div className="flex flex-wrap gap-3">
                {waiting.map((r) => (
                  <span key={r.queue_number} className="px-4 py-2 rounded-lg bg-blue-900/50 border border-blue-600">
                    {r.queue_number}
                  </span>
                ))}
              </div>
            </div>
          )}
          {rows.length === 0 && !loading && <p className="text-center text-gray-500">No one in queue</p>}
        </div>
      )}
    </div>
  );
}
