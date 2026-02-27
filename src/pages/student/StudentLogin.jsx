import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = loginStudent(studentId.trim());
    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E40AF] to-[#6D28D9] flex flex-col items-center px-4 py-12">
      <Link to="/" className="absolute top-6 left-6 text-white hover:underline flex items-center gap-1">
        ← Back to Home
      </Link>

      <div className="w-full max-w-sm mt-12">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
            N
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">Student Login</h1>
          <p className="text-sm text-gray-500 text-center mb-6">NWSSU Queue Management System</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID Number</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="2023-12345"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Login
            </button>
          </form>

          <p className="text-sm text-blue-600 text-center mt-4">
            <a href="#" className="hover:underline">For assistance, contact the Registrar's Office</a>
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-info-bg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">ℹ</span>
            <div>
              <p className="font-semibold text-blue-600">Demo Hints</p>
              <ul className="text-sm text-gray-700 mt-1 space-y-1">
                <li>• Try Student ID: 2023-12345</li>
                <li>• Queue updates happen in real-time</li>
                <li>• You can view QR code for verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-white/70 text-center">For assistance, contact the Registrar's Office</p>
    </div>
  );
}
