export default function PriorityQueueSteps() {
  const steps = [
    'Assigned automatically at cut-off if not served',
    'Priority numbers begin with "P" (e.g., EN-P003)',
    'Priority students are served BEFORE regular queue',
    'Valid only for the following business day',
    'Unused priority numbers expire at end of next business day',
  ];
  return (
    <div className="mx-4 mt-4 p-4 rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">How Priority Queue Works</h3>
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
