// pages/badges.jsx — GraamVidya XP Badges & Achievements
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Award, Lock, Star, Flame, Zap, Trophy, BookOpen, Users, Mic, Target } from 'lucide-react';

const ALL_BADGES = [
  // Streaks
  { id: 'streak3',  category: 'streak',   emoji: '🔥', name: '3-Day Fire',       desc: 'Log in 3 days in a row',              xp: 30,  req: { type: 'streak', value: 3   } },
  { id: 'streak7',  category: 'streak',   emoji: '🔥🔥', name: 'Week Warrior',   desc: 'Maintain a 7-day streak',             xp: 75,  req: { type: 'streak', value: 7   } },
  { id: 'streak30', category: 'streak',   emoji: '🔥💎', name: 'Diamond Flame',   desc: '30-day streak legend',                xp: 500, req: { type: 'streak', value: 30  } },
  // XP
  { id: 'xp100',    category: 'xp',       emoji: '⚡',   name: 'First Spark',     desc: 'Earn your first 100 XP',              xp: 20,  req: { type: 'xp', value: 100  } },
  { id: 'xp500',    category: 'xp',       emoji: '⭐',   name: 'Rising Star',     desc: 'Reach 500 XP',                        xp: 50,  req: { type: 'xp', value: 500  } },
  { id: 'xp1000',   category: 'xp',       emoji: '🌟',   name: 'Bright Scholar',  desc: 'Achieve 1000 XP',                     xp: 100, req: { type: 'xp', value: 1000 } },
  { id: 'xp5000',   category: 'xp',       emoji: '👑',   name: 'Village Legend',  desc: 'Earn 5000 XP — top of the village!',  xp: 500, req: { type: 'xp', value: 5000 } },
  // Learning
  { id: 'lesson1',  category: 'learning', emoji: '📖',   name: 'First Lesson',    desc: 'Complete your first micro lesson',     xp: 15,  req: { type: 'lessons', value: 1  } },
  { id: 'lesson10', category: 'learning', emoji: '📚',   name: 'Bookworm',        desc: 'Complete 10 lessons',                  xp: 80,  req: { type: 'lessons', value: 10 } },
  { id: 'quiz5',    category: 'learning', emoji: '🧠',   name: 'Quiz Champ',      desc: 'Complete 5 quizzes with 80%+ accuracy', xp: 100, req: { type: 'quizzes', value: 5  } },
  { id: 'revision', category: 'learning', emoji: '⚡',   name: 'Revision Master', desc: 'Revise 20 topics using Smart Revision', xp: 120, req: { type: 'revisions', value: 20 } },
  // Voice
  { id: 'voice1',   category: 'voice',    emoji: '🗣️',  name: 'Speaker Starter', desc: 'Complete first voice practice session', xp: 20,  req: { type: 'voice', value: 1  } },
  { id: 'voice7',   category: 'voice',    emoji: '🎙️',  name: 'English Warrior', desc: '7 voice practice sessions',             xp: 100, req: { type: 'voice', value: 7  } },
  // Social
  { id: 'community1', category: 'social', emoji: '👥',  name: 'Team Player',     desc: 'Join your first peer group',            xp: 25,  req: { type: 'posts', value: 1  } },
  { id: 'community5', category: 'social', emoji: '🌱',  name: 'Helpful Mentor',  desc: 'Help 5 students with their doubts',     xp: 150, req: { type: 'posts', value: 5  } },
  // Contest
  { id: 'contest1',  category: 'contest', emoji: '🏆',  name: 'Contest Debut',   desc: 'Participate in first Saturday contest', xp: 50,  req: { type: 'contests', value: 1 } },
  { id: 'contestW',  category: 'contest', emoji: '👑',  name: 'Contest Winner',  desc: 'Win a Saturday weekly contest',         xp: 500, req: { type: 'contestWins', value: 1 } },
  // Career
  { id: 'career',   category: 'career',   emoji: '🎯',  name: 'Career Explorer', desc: 'Visit Career Guidance section',         xp: 15,  req: { type: 'careerVisit', value: 1 } },
  { id: 'opps',     category: 'career',   emoji: '🎓',  name: 'Opportunity Seeker', desc: 'Apply for first scholarship',        xp: 50,  req: { type: 'scholarships', value: 1 } },
];

const CATEGORY_INFO = {
  streak:   { label: 'Streaks',   icon: Flame,   color: 'text-saffron-500' },
  xp:       { label: 'XP & Level', icon: Zap,     color: 'text-brand-600'  },
  learning: { label: 'Learning',  icon: BookOpen, color: 'text-indigo-500' },
  voice:    { label: 'Voice',     icon: Mic,      color: 'text-teal-500'   },
  social:   { label: 'Community', icon: Users,    color: 'text-rose-500'   },
  contest:  { label: 'Contests',  icon: Trophy,   color: 'text-amber-500'  },
  career:   { label: 'Career',    icon: Target,   color: 'text-emerald-500'},
};

function checkUnlocked(badge, progress) {
  const { type, value } = badge.req;
  const p = progress || {};
  switch (type) {
    case 'streak':       return (p.streak || 0) >= value;
    case 'xp':           return (p.xp || 0) >= value;
    case 'lessons':      return (p.lessonsCompleted || 0) >= value;
    case 'quizzes':      return (p.quizSessions || 0) >= value;
    case 'revisions':    return (p.revisionsCompleted || 0) >= value;
    case 'voice':        return (p.voiceSessions || 0) >= value;
    case 'posts':        return (p.postsMade || 0) >= value;
    case 'contests':     return (p.contestsJoined || 0) >= value;
    case 'contestWins':  return (p.contestWins || 0) >= value;
    case 'careerVisit':  return (p.careerVisited || 0) >= value;
    case 'scholarships': return (p.scholarshipsApplied || 0) >= value;
    default:             return false;
  }
}

const TABS = ['All', 'Earned', 'Locked'];
const CATEGORIES = ['all', ...Object.keys(CATEGORY_INFO)];

export default function BadgesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('All');
  const [category, setCategory] = useState('all');
  const [progress, setProgress] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      try {
        const key = `gv_progress_${user.uid}`;
        const p = JSON.parse(localStorage.getItem(key) || '{}');
        setProgress({ xp: user.xp || 0, streak: user.streak || 0, ...p });
      } catch {}
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const withUnlock = ALL_BADGES.map(b => ({ ...b, unlocked: checkUnlocked(b, progress) }));
  const earned = withUnlock.filter(b => b.unlocked);
  const locked = withUnlock.filter(b => !b.unlocked);

  let displayed = tab === 'Earned' ? earned : tab === 'Locked' ? locked : withUnlock;
  if (category !== 'all') displayed = displayed.filter(b => b.category === category);

  const totalXP = earned.reduce((s, b) => s + b.xp, 0);

  return (
    <AppShell title="Badges & Rewards" back onBack={() => router.push('/home')}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Stats banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-400 to-saffron-500 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-600">Your Badges</p>
              <p className="font-display font-900 text-white text-4xl">{earned.length}<span className="text-xl">/{ALL_BADGES.length}</span></p>
              <p className="text-white/70 text-xs mt-1">+{totalXP} XP from badges</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award size={34} className="text-white" />
            </div>
          </div>
        </div>

        {/* Tab filter */}
        <div className="flex bg-slate-100 rounded-2xl p-1 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-700 transition-all ${tab === t ? 'bg-white text-brand-700 shadow-card' : 'text-slate-400'}`}>
              {t} {t === 'Earned' ? `(${earned.length})` : t === 'Locked' ? `(${locked.length})` : ''}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {CATEGORIES.map(c => {
            const info = CATEGORY_INFO[c];
            return (
              <button key={c} onClick={() => setCategory(c)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-700 transition-all border ${
                  category === c ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200'
                }`}>
                {c === 'all' ? '🏅 All' : `${info.label}`}
              </button>
            );
          })}
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
          {displayed.map((badge, i) => (
            <button key={badge.id} onClick={() => setSelected(badge)}
              className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all active:scale-95 animate-pop text-center ${
                badge.unlocked
                  ? 'bg-white border-amber-200 shadow-card'
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
              style={{ animationDelay: `${110 + i * 25}ms` }}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2 ${
                badge.unlocked ? 'bg-gradient-to-br from-amber-100 to-amber-50' : 'bg-slate-100 grayscale'
              }`}>
                {badge.unlocked ? badge.emoji : <Lock size={22} className="text-slate-400" />}
              </div>
              <p className={`font-700 text-xs leading-snug ${badge.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                {badge.name}
              </p>
              {badge.unlocked && (
                <span className="mt-1 text-[10px] font-700 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  +{badge.xp} XP
                </span>
              )}
            </button>
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">🔒</p>
            <p className="text-slate-500 font-600">No badges here yet.</p>
            <p className="text-slate-400 text-sm">Keep learning to unlock them!</p>
          </div>
        )}

        {/* Badge detail modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-in" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-4 ${
                  selected.unlocked ? 'bg-gradient-to-br from-amber-100 to-amber-50 shadow-lg' : 'bg-slate-100 grayscale'
                }`}>
                  {selected.unlocked ? selected.emoji : '🔒'}
                </div>
                <h3 className="font-display font-900 text-xl text-slate-900 mb-1">{selected.name}</h3>
                <p className="text-slate-500 text-sm mb-3">{selected.desc}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-700 ${
                    selected.unlocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {selected.unlocked ? `✅ Earned · +${selected.xp} XP` : `🔒 +${selected.xp} XP when earned`}
                  </span>
                </div>
                {!selected.unlocked && (
                  <button onClick={() => { setSelected(null); router.push('/learn'); }}
                    className="mt-4 w-full bg-brand-700 text-white font-700 py-3 rounded-2xl active:scale-95 transition-all">
                    Go Learn to Unlock →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
