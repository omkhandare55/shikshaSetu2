// components/ui/Spinner.jsx — Clean loading spinner
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[2.5px]',
    xl: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={`${sizes[size]} border-surface-200 border-t-brand-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
