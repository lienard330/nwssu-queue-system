import { useState, useEffect } from 'react';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function PriorityRequestsBanner() {
  const queueApi = useQueueApi();
  const { auth } = useAuth();
  const { toast } = useToast();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const list = await queueApi.getPriorityPending();
        setPending(Array.isArray(list) ? list : []);
      } catch (e) {
        setPending([]);
      }
    };
    queueApi.checkBackend().then((ok) => ok && fetchPending());
    const iv = setInterval(fetchPending, 10000);
    return () => clearInterval(iv);
  }, [queueApi]);

  const handleApprove = async (ticketId) => {
    setLoading(true);
    try {
      await queueApi.approvePriority(ticketId, auth?.user?.username);
      toast.success('Approved', 'Priority request approved');
      setPending((p) => p.filter((r) => r.ticket_id !== ticketId));
    } catch (e) {
      toast.error('Error', e.message);
    }
    setLoading(false);
  };

  const handleDowngrade = async (ticketId) => {
    setLoading(true);
    try {
      await queueApi.downgradePriority(ticketId, auth?.user?.username);
      toast.info('Downgraded', 'Priority request downgraded to regular');
      setPending((p) => p.filter((r) => r.ticket_id !== ticketId));
    } catch (e) {
      toast.error('Error', e.message);
    }
    setLoading(false);
  };

  if (pending.length === 0) return null;

  return (
    <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in">
      <h3 className="font-semibold text-amber-800 mb-2">⏳ Pending Priority Requests ({pending.length})</h3>
      <div className="space-y-2">
        {pending.map((pr) => (
          <div key={pr.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-amber-100">
            <div>
              <span className="font-medium">{pr.queue_number}</span>
              <span className="text-gray-500 ml-2">— {pr.student_name}</span>
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">{pr.reason}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(pr.ticket_id)}
                disabled={loading}
                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleDowngrade(pr.ticket_id)}
                disabled={loading}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Downgrade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
