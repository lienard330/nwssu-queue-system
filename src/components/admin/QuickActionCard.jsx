import { Link } from 'react-router-dom';

export default function QuickActionCard({ icon: Icon, title, description, to, buttonText }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-md">
      <Icon className="w-8 h-8 text-blue-600 mb-3" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <Link to={to} className="inline-block mt-4 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
        {buttonText}
      </Link>
    </div>
  );
}
