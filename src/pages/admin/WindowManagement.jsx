import { useState } from 'react';
import { Plus } from 'lucide-react';
import { mockWindows } from '../../data/mockWindows';
import { useToast } from '../../context/ToastContext';
import WindowCard from '../../components/admin/WindowCard';
import EditWindowModal from '../../components/admin/EditWindowModal';

export default function WindowManagement() {
  const { toast } = useToast();
  const [windows, setWindows] = useState(mockWindows);
  const [editWindow, setEditWindow] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = (w) => {
    if (editWindow) {
      setWindows((prev) => prev.map((x) => (x.id === w.id ? { ...x, ...w } : x)));
      toast.success('Window Updated', `${w.name} updated successfully`);
    } else {
      setWindows((prev) => [...prev, { ...w, id: prev.length + 1 }]);
      toast.success('Window Added', 'Window added successfully');
    }
    setEditWindow(null);
    setShowAdd(false);
  };

  const activeCount = windows.filter((w) => w.status === 'Active').length;
  const onBreakCount = windows.filter((w) => w.status === 'OnBreak').length;
  const inactiveCount = windows.filter((w) => w.status === 'Inactive').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Window Management</h1>
          <p className="text-sm text-gray-500 mt-1">Assign and manage service windows</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
            <Plus className="w-4 h-4" /> Add Window
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Save Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {windows.map((w) => (
          <WindowCard key={w.id} window={w} onEdit={setEditWindow} />
        ))}
        <button
          onClick={() => setShowAdd(true)}
          className="p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center min-h-[200px] text-gray-500 hover:text-gray-700"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm">Add New Window</span>
        </button>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-white shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Window Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-green-50">
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-sm text-gray-500">Active Windows</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50">
            <p className="text-2xl font-bold text-gray-900">{onBreakCount}</p>
            <p className="text-sm text-gray-500">On Break</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{inactiveCount}</p>
            <p className="text-sm text-gray-500">Inactive</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{windows.length}</p>
            <p className="text-sm text-gray-500">Total Windows</p>
          </div>
        </div>
      </div>

      {editWindow && <EditWindowModal window={editWindow} onClose={() => setEditWindow(null)} onSave={handleSave} />}
      {showAdd && <EditWindowModal window={{}} onClose={() => setShowAdd(false)} onSave={handleSave} isAdd />}
    </div>
  );
}
