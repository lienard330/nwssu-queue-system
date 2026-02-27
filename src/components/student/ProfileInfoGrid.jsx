const items = [
  { label: 'Full Name', key: 'name', icon: '👤' },
  { label: 'Student ID', key: 'id', icon: '🪪' },
  { label: 'Program', key: 'program', icon: '📚' },
  { label: 'Year Level', key: 'year', icon: '📅' },
  { label: 'Email Address', key: 'email', icon: '📧' },
  { label: 'Academic Year', value: '2025–2026', icon: '🗓️' },
];

export default function ProfileInfoGrid({ student }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4 px-4">
      {items.map((item) => (
        <div key={item.key || item.label} className="p-4 rounded-xl bg-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{item.value || (student && student[item.key])}</p>
        </div>
      ))}
    </div>
  );
}
