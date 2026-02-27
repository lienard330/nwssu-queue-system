import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { enrollmentServing, enrollmentWaiting } from '../../data/mockQueues';
import OperatorActionButtons from '../../components/admin/OperatorActionButtons';
import OperatorBreakOverlay from '../../components/admin/OperatorBreakOverlay';
import OperatorUpNextCards from '../../components/admin/OperatorUpNextCards';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function OperatorView() {
  const { auth, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [onBreak, setOnBreak] = useState(false);
  const [nowServing, setNowServing] = useState(enrollmentServing.find((s) => s.windowId === 2) || { queueNum: 'EN-010', student: 'Cruz, Juan (2023-12345)' });
  const [waiting, setWaiting] = useState(enrollmentWaiting);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [confirmNoShow, setConfirmNoShow] = useState(false);
  const [confirmBreak, setConfirmBreak] = useState(false);

  const handleComplete = () => {
    setConfirmComplete(true);
  };

  const doComplete = () => {
    const next = waiting[0];
    if (next) {
      setNowServing({ queueNum: next.num, student: `${next.student} (${next.id})` });
      setWaiting((w) => w.slice(1));
      toast.success('Student Called', `${next.num} called to Window #2`);
    }
    setConfirmComplete(false);
  };

  const handleRecall = () => {
    toast.info('Recall', 'EN-010 has been recalled to Window #2');
  };

  const handleNoShow = () => setConfirmNoShow(true);

  const doNoShow = () => {
    const next = waiting[0];
    if (next) {
      setNowServing({ queueNum: next.num, student: `${next.student} (${next.id})` });
      setWaiting((w) => w.slice(1));
    }
    toast.warning('No-Show', 'EN-010 marked as No-Show');
    setConfirmNoShow(false);
  };

  const handleBreak = () => setConfirmBreak(true);

  const doBreak = () => {
    setOnBreak(true);
    setConfirmBreak(false);
  };

  const handleResume = () => {
    setOnBreak(false);
    toast.success('Window Resumed', 'Window #2 resumed');
  };

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  const studentInfo = nowServing?.student?.match(/(.+)\s+\((.+)\)/);
  const studentName = studentInfo ? studentInfo[1] : '—';
  const studentId = studentInfo ? studentInfo[2] : '—';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">N</div>
          <span className="font-semibold text-gray-900">NWSSU Queue System</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Window #2 — Enrollment</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{auth?.user?.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">Window Operator</span>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="relative bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-8 flex-1">
          {onBreak ? (
            <OperatorBreakOverlay windowName="Window #2" onResume={handleResume} />
          ) : (
            <>
              <p className="text-sm uppercase tracking-widest text-white/70 text-center">NOW SERVING</p>
              <p className="text-7xl font-bold text-center mt-2">{nowServing?.queueNum}</p>
              <div className="max-w-lg mx-auto mt-4 p-4 rounded-xl bg-white/20">
                <p className="font-semibold">{studentName}</p>
                <p className="text-sm text-white/80">2023-12345 · BSIT · 3rd Year</p>
                <div className="flex gap-4 mt-2 text-sm text-white/80">
                  <span>Joined: 11:39 PM</span>
                  <span>Wait: 22 min</span>
                </div>
              </div>
              <div className="mt-6">
                <OperatorActionButtons
                  onComplete={handleComplete}
                  onRecall={handleRecall}
                  onNoShow={handleNoShow}
                  onBreak={handleBreak}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Up Next</h3>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-sm">Enrollment Queue</span>
            <span className="text-sm text-gray-500">{waiting.length} students waiting</span>
          </div>
          <OperatorUpNextCards waiting={waiting} />
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-center">
            <div>
              <p className="text-xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-500">Total Served Today</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">8 min</p>
              <p className="text-xs text-gray-500">Avg Transaction Time</p>
            </div>
            <div>
              <p className="text-xl font-bold text-purple-600">2h 14m</p>
              <p className="text-xs text-gray-500">Window Active Time</p>
            </div>
          </div>
          {isAdmin && (
            <Link to="/staff/dashboard" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
              ← Back to Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      {confirmComplete && (
        <ConfirmModal
          title="Complete EN-010 and call EN-013?"
          message="The current student will be marked complete and the next in line will be called."
          confirmText="Complete & Call Next"
          cancelText="Cancel"
          onConfirm={doComplete}
          onCancel={() => setConfirmComplete(false)}
        />
      )}
      {confirmNoShow && (
        <ConfirmModal
          title="Mark EN-010 as No-Show?"
          message="Next student will be called automatically."
          confirmText="Mark No-Show"
          cancelText="Cancel"
          onConfirm={doNoShow}
          onCancel={() => setConfirmNoShow(false)}
        />
      )}
      {confirmBreak && (
        <ConfirmModal
          title="Put Window #2 on break?"
          message="No students will be called until you resume."
          confirmText="Put on Break"
          cancelText="Cancel"
          onConfirm={doBreak}
          onCancel={() => setConfirmBreak(false)}
        />
      )}
    </div>
  );
}
