// components/ui/Toast.jsx — Toast notification
import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 3000, variant = 'default' }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const variants = {
    default: 'bg-surface-900 text-white',
    success: 'bg-success-600 text-white',
    error:   'bg-red-600 text-white',
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${variants[variant]}
      text-sm font-semibold px-5 py-3 rounded-xl shadow-elevated animate-slide-down`}>
      {message}
    </div>
  );
}
