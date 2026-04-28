// components/ui/Badge.jsx — Badge component
export default function Badge({ children, variant = 'brand', className = '' }) {
  const variants = {
    brand:   'badge-brand',
    success: 'badge-success',
    accent:  'badge-accent',
    surface: 'badge-surface',
  };

  return (
    <span className={`${variants[variant] || variants.brand} ${className}`}>
      {children}
    </span>
  );
}
