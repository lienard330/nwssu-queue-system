import { Search } from 'lucide-react';

export default function LogsFilterBar({ onFilter }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search logs..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300" />
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-300">
          <option>All Services</option>
          <option>Enrollment</option>
          <option>Clearance</option>
          <option>Transcript</option>
          <option>INC</option>
          <option>System</option>
        </select>
        <select className="px-4 py-2 rounded-lg border border-gray-300">
          <option>All Actions</option>
          <option>Queue Created</option>
          <option>Queue Called</option>
          <option>Queue Completed</option>
          <option>No-Show</option>
          <option>Cancelled</option>
          <option>Login</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Clear Filters</button>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Apply Filters</button>
      </div>
    </div>
  );
}
