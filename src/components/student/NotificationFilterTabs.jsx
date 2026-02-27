export default function NotificationFilterTabs({ activeTab, onTabChange, unreadCount }) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'queue', label: 'Queue Updates' },
    { id: 'system', label: 'System' },
  ];
  return (
    <div className="flex gap-4 px-4 overflow-x-auto pb-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
