import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { loginStaff } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = loginStaff(username, password);
    if (result.success) {
      // Role is auto-assigned from login: admin→Administrator, staff→Registrar Staff, operator→Window Operator
      const role = result.role;
      if (role === 'Window Operator') navigate('/staff/operators');
      else if (role === 'Registrar Staff') navigate('/staff/queues');
      else navigate('/staff/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1D4ED8] to-[#6D28D9] flex flex-col items-center px-4 py-12">
      <Link to="/" className="absolute top-6 left-6 text-white hover:underline flex items-center gap-1">
        ← Back to Home
      </Link>

      <div className="w-full max-w-sm mt-12">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">NWSSU Registrar Portal</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Secure Staff Access Only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Login
            </button>
          </form>

          <p className="text-sm text-blue-600 text-center mt-4">
            <a href="#" className="hover:underline">Forgot password? Contact IT Support</a>
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-info-bg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">ℹ</span>
            <div>
              <p className="font-semibold text-blue-600">Demo Access — Different roles, different screens</p>
              <ul className="text-sm text-gray-700 mt-2 space-y-2">
                <li><strong>admin</strong> / admin123 → Administrator (full dashboard, queues, windows, reports, logs, settings)</li>
                <li><strong>staff</strong> / staff123 → Registrar Staff (queues + windows only)</li>
                <li><strong>operator</strong> / op123 → Window Operator (single window transaction view)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">You go directly to your role&apos;s screen after login — no role selection.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-white/60 text-center">Authorized personnel only. All access is logged.</p>
    </div>
  );
}
