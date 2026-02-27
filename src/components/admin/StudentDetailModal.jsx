import Modal from '../common/Modal';

export default function StudentDetailModal({ student, serviceName, onClose, onCall }) {
  return (
    <Modal title={student?.num} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="text-gray-500">Full Name:</span><p className="font-medium">{student?.student}</p></div>
        <div><span className="text-gray-500">Student ID:</span><p className="font-medium">{student?.id}</p></div>
        <div><span className="text-gray-500">Course:</span><p className="font-medium">{student?.course}</p></div>
        <div><span className="text-gray-500">Queue Position:</span><p className="font-medium">#{student?.pos}</p></div>
        <div><span className="text-gray-500">Joined At:</span><p className="font-medium">{student?.joinedAt}</p></div>
        <div><span className="text-gray-500">Wait Time:</span><p className="font-medium">{student?.waitTime} min</p></div>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        <button onClick={onCall} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">📞 Call to Window</button>
        <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm hover:bg-blue-50">↔ Transfer</button>
        <button className="px-4 py-2 rounded-lg border border-red-600 text-red-600 text-sm hover:bg-red-50">✗ No-Show</button>
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">⊘ Cancel</button>
      </div>
    </Modal>
  );
}
