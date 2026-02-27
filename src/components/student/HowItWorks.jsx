export default function HowItWorks() {
  const steps = [
    'Select a service to join the queue',
    'Track your position in real-time',
    'Get notified when it\'s your turn',
    'Proceed to the assigned window',
  ];
  return (
    <div className="mx-4 p-4 rounded-xl bg-info-bg">
      <h3 className="font-semibold text-blue-600 mb-3">How it works</h3>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
