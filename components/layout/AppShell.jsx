// components/layout/AppShell.jsx — Professional app shell
import BottomNav from './BottomNav';

export default function AppShell({ children, title, right, back, onBack, left }) {
  return (
    <div className="min-h-screen sm:min-h-[100dvh] bg-surface-50 flex flex-col max-w-md mx-auto relative overflow-x-hidden">
      {/* Top bar */}
      {title && (
        <header className="sticky top-0 z-30 glass border-b border-surface-100/80 px-4 py-3 flex items-center gap-3">
          {left ? (
            <div className="shrink-0 -ml-1">{left}</div>
          ) : (
            back && (
              <button
                onClick={onBack}
                className="w-9 h-9 -ml-1 rounded-xl hover:bg-surface-100 flex items-center justify-center transition-colors text-surface-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
            )
          )}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
              <span className="text-white font-display font-bold text-xs tracking-tight">GV</span>
            </div>
            <h1 className="font-display font-bold text-surface-800 text-[15px] tracking-tight truncate">{title}</h1>
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}

      {/* Page content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
