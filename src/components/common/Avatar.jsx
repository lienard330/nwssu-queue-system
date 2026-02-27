export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ? name
        .split(/[\s,]+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-2xl', xl: 'w-20 h-20 text-2xl' };
  return (
    <div className={`rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ${sizes[size] || sizes.md} ${className}`}>{initials}</div>
  );
}
