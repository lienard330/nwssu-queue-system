export default function StatCard({ icon: Icon, label, value, subLabel, color = 'blue' }) {
  const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', yellow: 'bg-amber-100 text-amber-600', purple: 'bg-purple-100 text-purple-600' };
  return (
    <div className="p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500">{subLabel}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
