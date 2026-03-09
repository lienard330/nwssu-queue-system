import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueueApi } from '../../hooks/useQueueApi';
import { Wifi, WifiOff, ExternalLink } from 'lucide-react';

export default function BackendStatusBanner() {
  const queueApi = useQueueApi();
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    queueApi.checkBackend().then(setConnected);
  }, [queueApi]);

  if (connected === null) return null;

  if (connected) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Backend connected — Full features enabled</span>
        </div>
        <Link to="/display/EN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900">
          Queue Display <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in">
      <div className="flex items-center gap-2 text-amber-800">
        <WifiOff className="w-5 h-5" />
        <span className="font-medium">Backend not connected</span>
      </div>
      <p className="text-sm text-amber-700 mt-1">
        Run <code className="px-1.5 py-0.5 bg-amber-100 rounded">cd server && npm run dev</code> to enable: Call Next, Walk-In, Transfer, Priority approval, Carry-over tickets, Audit logs.
      </p>
    </div>
  );
}
