// components/ui/Avatar.jsx — Avatar component
export default function Avatar({ name, photo, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = (name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (photo) {
    return (
      <img
        src={photo}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} bg-brand-600 rounded-xl flex items-center justify-center shrink-0 ${className}`}>
      <span className="font-display font-bold text-white">{initials}</span>
    </div>
  );
}
