export default function OperatorUpNextCards({ waiting }) {
  const labels = ['Next', '2nd', '3rd'];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {waiting.slice(0, 3).map((s, i) => (
        <div
          key={s.num}
          className={`p-4 rounded-xl ${i === 0 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
        >
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${i === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
            {labels[i]}
          </span>
          <p className={`text-xl font-bold mt-2 ${i === 0 ? 'text-blue-600' : 'text-gray-900'}`}>{s.num}</p>
          <p className="font-semibold text-gray-900">{s.student}</p>
          <p className="text-sm text-gray-500">{s.course} · {s.year || '—'}</p>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">⏱ Wait: {s.waitTime} min</p>
        </div>
      ))}
    </div>
  );
}
