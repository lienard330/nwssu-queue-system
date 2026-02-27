import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/common/Avatar';
import ProfileInfoGrid from '../../components/student/ProfileInfoGrid';
import ProfileQueueHistory from '../../components/student/ProfileQueueHistory';
import ProfileEditModal from '../../components/student/ProfileEditModal';

export default function StudentProfile() {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const student = auth?.user;

  const handleSave = (email) => {
    toast.success('Profile Updated', 'Email updated successfully');
    setShowEdit(false);
  };

  return (
    <div className="px-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/student/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="mt-4 p-6 rounded-xl bg-white shadow-md text-center">
        <Avatar name={student?.name} size="xl" className="mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 mt-3">{student?.name}</h2>
        <p className="text-sm text-gray-500">{student?.course} · {student?.year} · {student?.id}</p>
        <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
          <Mail className="w-4 h-4" /> {student?.email}
        </p>
        <button onClick={() => setShowEdit(true)} className="mt-4 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50">
          ✏️ Edit Profile
        </button>
      </div>

      <ProfileInfoGrid student={student} />
      <ProfileQueueHistory />

      {showEdit && <ProfileEditModal isOpen={showEdit} onClose={() => setShowEdit(false)} student={student} onSave={handleSave} />}
    </div>
  );
}
