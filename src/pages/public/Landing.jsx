import { Link } from 'react-router-dom';
import { Users, UserCog } from 'lucide-react';
import { useState } from 'react';
import HelpModal from '../../components/common/HelpModal';

export default function Landing() {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E40AF] to-[#6D28D9] flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="max-w-4xl w-full mx-auto text-center">
        <div className="w-20 h-20 mx-auto rounded-xl bg-white shadow-lg flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-blue-600">N</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">NWSSU Queue Management System</h1>
        <p className="text-base text-white/70 mb-8">Northwestern Samar State University — Registrar Portal</p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 flex-1 max-w-sm mx-auto w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Student Portal</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Join queue, track your position, and receive notifications</p>
            <Link to="/student/login" className="block w-full py-3 px-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 text-center">
              Student Login
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex-1 max-w-sm mx-auto w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Staff Portal</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Manage queues, windows, and monitor real-time activity</p>
            <Link
              to="/staff/login"
              className="block w-full py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-center"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 text-sm text-white/60 text-center">© 2026 Northwestern Samar State University. All rights reserved.</p>

      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg"
      >
        ?
      </button>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
