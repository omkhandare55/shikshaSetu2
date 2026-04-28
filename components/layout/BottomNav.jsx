// components/layout/BottomNav.jsx — Professional bottom navigation
import { useRouter } from 'next/router';
import { Home, BookOpen, Brain, Award, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/home',     icon: Home,     label: 'Home'    },
  { href: '/syllabus', icon: BookOpen,  label: 'Learn'   },
  { href: '/quiz',     icon: Brain,     label: 'Quiz'    },
  { href: '/courses',  icon: Award,     label: 'Courses' },
  { href: '/profile',  icon: User,      label: 'Profile' },
];

export default function BottomNav() {
  const router  = useRouter();
  const current = router.pathname;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t border-surface-100/80 pb-safe">
      <div className="max-w-md mx-auto flex items-stretch">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = current === href || current.startsWith(href + '/');
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`nav-item flex-1 relative ${active ? 'active' : ''}`}
            >
              {/* Active indicator dot */}
              {active && (
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-brand-500" />
              )}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-brand-50' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.6}
                  className={`transition-colors duration-200 ${active ? 'text-brand-600' : 'text-surface-400'}`}
                />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                active ? 'text-brand-600' : 'text-surface-400'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
