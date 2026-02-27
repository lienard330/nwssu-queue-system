import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ClipboardList, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffRoleSelect() {
  const { auth, setRole } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (auth?.user?.username === 'operator') {
      setRole('Window Operator');
      navigate('/staff/operators', { replace: true });
    }
  }, [auth, setRole, navigate]);

  const roles = [];
  if (auth?.user?.username === 'admin') {
    roles.push(
      { id: 'Administrator', icon: LayoutDashboard, label: 'Administrator', desc: 'Full access: Dashboard, Queues, Windows, Reports, Logs, Settings' },
      { id: 'Registrar Staff', icon: ClipboardList, label: 'Registrar Staff', desc: 'Queue and window management access only' },
      { id: 'Window Operator', icon: Monitor, label: 'Window Operator', desc: 'Single-window focused transaction view' }
    );
  } else if (auth?.user?.username === 'staff') {
    roles.push(
      { id: 'Registrar Staff', icon: ClipboardList, label: 'Registrar Staff', desc: 'Queue and window management access only' },
      { id: 'Window Operator', icon: Monitor, label: 'Window Operator', desc: 'Single-window focused transaction view' }
    );
  } else if (auth?.user?.username === 'operator') {
    roles.push({ id: 'Window Operator', icon: Monitor, label: 'Window Operator', desc: 'Single-window focused transaction view' });
  }

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    if (selected === 'Administrator') navigate('/staff/dashboard');
    else if (selected === 'Registrar Staff') navigate('/staff/queues');
    else navigate('/staff/operators');
  };

  if (auth?.user?.username === 'operator') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1D4ED8] to-[#6D28D9] flex flex-col items-center px-4 py-12">
      <Link to="/staff/login" className="absolute top-6 left-6 text-white hover:underline">← Back to Login</Link>

      <div className="w-full max-w-md mt-12">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900">Welcome back, {auth?.user?.name}!</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Select your role to continue</p>

          <div className="space-y-3 mt-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <role.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                  </div>
                  {selected === role.id && (
                    <span className="ml-auto w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selected}
            className="w-full mt-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">Your access is determined by assigned role. Contact admin if role is incorrect.</p>
        </div>
      </div>
    </div>
  );
}
