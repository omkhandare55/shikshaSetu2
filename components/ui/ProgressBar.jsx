// components/ui/ProgressBar.jsx — Progress bar component
export default function ProgressBar({ value = 0, max = 100, color = 'bg-brand-500', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`progress-track ${className}`}>
      <div
        className={`progress-fill ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
