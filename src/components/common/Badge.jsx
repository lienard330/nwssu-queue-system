const variants = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-800',
};

export default function Badge({ children, variant = 'gray', className = '' }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${variants[variant] || variants.gray} ${className}`}>{children}</span>;
}
