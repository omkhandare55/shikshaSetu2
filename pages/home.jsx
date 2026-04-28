// pages/home.jsx — GraamVidya | Professional Dashboard
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import {
  Flame, Zap, BookOpen, Brain, Mic, ChevronRight, Trophy, Sparkles,
  Star, Lock, CheckCircle2, Target, Award, Play, TrendingUp, Calendar,
} from 'lucide-react';

function getLevel(xp) {
  if (xp < 100)  return { level: 1, next: 100 };
  if (xp < 300)  return { level: 2, next: 300 };
  if (xp < 600)  return { level: 3, next: 600 };
  if (xp < 1000) return { level: 4, next: 1000 };
  if (xp < 2000) return { level: 5, next: 2000 };
  return { level: Math.floor(xp / 500) + 1, next: (Math.floor(xp / 500) + 2) * 500 };
}

// ── Zigzag path nodes ─────────────────────────────────────────
const PATH_NODES = [
  { id: 'math1',  icon: '📐', label: 'Algebra Basics',       xp: 20, subject: 'Math',    side: 'left'  },
  { id: 'sci1',   icon: '🔬', label: 'Photosynthesis',       xp: 20, subject: 'Science', side: 'right' },
  { id: 'eng1',   icon: '📚', label: 'Active/Passive Voice', xp: 20, subject: 'English', side: 'left'  },
  { id: 'quiz1',  icon: '🧠', label: 'Daily Quiz',           xp: 15, subject: 'Quiz',    side: 'center'},
  { id: 'math2',  icon: '📊', label: 'Statistics',           xp: 20, subject: 'Math',    side: 'right' },
  { id: 'sci2',   icon: '⚡', label: 'Electric Circuits',    xp: 20, subject: 'Science', side: 'left'  },
  { id: 'voice1', icon: '🎤', label: 'Voice Practice',       xp: 10, subject: 'English', side: 'center'},
  { id: 'cert1',  icon: '🏆', label: 'Chapter Test',         xp: 50, subject: 'Test',    side: 'right' },
];

const QUICK_ACTIONS = [
  { href: '/syllabus', icon: BookOpen,  label: 'My Syllabus',    desc: 'Chapter-wise lessons',    color: 'bg-brand-500'    },
  { href: '/chat',     icon: Sparkles,  label: 'AI Tutor',       desc: 'Ask any doubt',           color: 'bg-violet-500'   },
  { href: '/revision', icon: Zap,       label: 'Smart Revision', desc: 'Quick exam prep',         color: 'bg-rose-500'     },
  { href: '/voice',    icon: Mic,       label: 'Voice Practice', desc: 'Improve English',         color: 'bg-teal-500'     },
];

const DAILY_QUESTS = [
  { id: 'lesson', icon: BookOpen, title: 'Complete a Lesson', xp: 20, href: '/learn'          },
  { id: 'quiz',   icon: Brain,    title: 'Take Daily Quiz',   xp: 15, href: '/quiz?mode=daily' },
  { id: 'voice',  icon: Mic,      title: 'Voice Practice',    xp: 10, href: '/voice'           },
  { id: 'revise', icon: Zap,      title: 'Smart Revision',    xp: 10, href: '/revision'        },
];

// ── Path Node Component ──────────────────────────────────────
function PathNode({ node, index, completed, locked, onTap }) {
  const posClass = node.side === 'center' ? 'mx-auto'
    : node.side === 'right' ? 'mr-6 ml-auto'
    : 'ml-6';

  const subjectColors = {
    Math: 'bg-brand-50 text-brand-600',
    Science: 'bg-violet-50 text-violet-600',
    English: 'bg-teal-50 text-teal-600',
    Quiz: 'bg-amber-50 text-amber-600',
    Test: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className={`relative flex flex-col items-center ${posClass} w-20`}>
      {/* Connector */}
      {index > 0 && (
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 ${
          completed ? 'bg-success-300' : 'bg-surface-200'
        }`} />
      )}

      <button
        onClick={() => !locked && onTap(node)}
        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
          locked
            ? 'border-surface-200 bg-surface-100 opacity-50 cursor-not-allowed'
            : completed
            ? 'border-success-400 bg-success-500 shadow-sm'
            : 'border-brand-400 bg-brand-500 shadow-glow hover:scale-105'
        } ${!locked ? 'active:scale-95' : ''}`}
      >
        {locked
          ? <Lock size={16} className="text-surface-400" />
          : completed
          ? <CheckCircle2 size={18} className="text-white" />
          : <span className="text-xl">{node.icon}</span>
        }
      </button>

      <div className="mt-2 text-center">
        <p className={`text-[11px] font-semibold leading-tight ${locked ? 'text-surface-400' : 'text-surface-700'}`}>
          {node.label}
        </p>
        {!locked && (
          <span className="text-[10px] text-accent-600 font-semibold">+{node.xp} XP</span>
        )}
      </div>
      {!locked && (
        <span className={`mt-1 text-2xs font-bold px-2 py-0.5 rounded-full ${subjectColors[node.subject] || 'bg-surface-100 text-surface-500'}`}>
          {node.subject}
        </span>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [xp, setXp]             = useState(0);
  const [streak, setStreak]     = useState(0);
  const [questsDone, setQuestsDone] = useState({});
  const [completedIds, setCompletedIds] = useState([]);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    try {
      const prog    = JSON.parse(localStorage.getItem(`ss_progress_${user.uid}`) || '{}');
      const gvProg  = JSON.parse(localStorage.getItem(`gv_progress_${user.uid}`) || '{}');
      setXp(prog.xp || gvProg.xp || user.xp || 0);
      setStreak(prog.streak || gvProg.streak || user.streak || 0);

      const today = new Date().toDateString();
      const done  = JSON.parse(localStorage.getItem(`gv_daily_${user.uid}_${today}`) || '{}');
      setQuestsDone(done);

      const cIds = JSON.parse(localStorage.getItem(`gv_path_${user.uid}`) || '[]');
      setCompletedIds(cIds);
    } catch {}
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-50"><Spinner size="lg" /></div>;
  }

  const firstName   = user.name?.split(' ')[0] || 'Learner';
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const { level, next } = getLevel(xp);
  const xpPct       = Math.min(100, Math.round((xp / next) * 100));
  const questCount  = Object.keys(questsDone).length;
  const today       = new Date();
  const isSaturday  = today.getDay() === 6;
  const daysToSat   = (6 - today.getDay() + 7) % 7 || 7;

  const markQuest = (id) => {
    const todayKey = `gv_daily_${user.uid}_${today.toDateString()}`;
    const done = { ...questsDone, [id]: true };
    setQuestsDone(done);
    localStorage.setItem(todayKey, JSON.stringify(done));
  };

  const handlePathTap = (node) => {
    if (!completedIds.includes(node.id)) {
      const newCompleted = [...completedIds, node.id];
      localStorage.setItem(`gv_path_${user.uid}`, JSON.stringify(newCompleted));
      setCompletedIds(newCompleted);
      const prog = JSON.parse(localStorage.getItem(`gv_progress_${user.uid}`) || '{}');
      const newXp = (prog.xp || 0) + node.xp;
      localStorage.setItem(`gv_progress_${user.uid}`, JSON.stringify({ ...prog, xp: newXp }));
      setXp(newXp);
      setToast(`+${node.xp} XP earned!`);
      setTimeout(() => setToast(null), 2500);
    }
    if (node.subject === 'Quiz') router.push('/quiz?mode=daily');
    else if (node.subject === 'Test') router.push('/quiz?mode=saturday');
    else router.push('/learn');
  };

  const isNodeLocked = (idx) => {
    if (idx === 0) return false;
    return !completedIds.includes(PATH_NODES[idx - 1]?.id);
  };

  return (
    <AppShell>
      <div className="px-4 pt-5 pb-28 space-y-5">

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-surface-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-elevated animate-slide-down">
            {toast}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-start justify-between animate-enter">
          <div>
            <p className="text-surface-400 text-sm font-medium">{greeting},</p>
            <h2 className="font-display font-extrabold text-2xl text-surface-900 tracking-tight mt-0.5">{firstName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-brand">Level {level}</span>
              <span className="badge-surface">Class {user.class || '?'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
              <Flame size={16} className="text-amber-500" />
              <div>
                <p className="font-display font-bold text-amber-700 text-sm leading-none">{streak}</p>
                <p className="text-amber-500 text-2xs font-medium">streak</p>
              </div>
            </div>
            {/* Avatar */}
            <button onClick={() => router.push('/profile')}
              className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all">
              <span className="font-display font-bold text-white text-sm">{firstName[0]}</span>
            </button>
          </div>
        </div>

        {/* ── XP Progress ── */}
        <div className="animate-enter delay-1 card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-accent-600" />
              </div>
              <div>
                <p className="font-display font-bold text-surface-800 text-sm">{xp} XP</p>
                <p className="text-surface-400 text-xs">{next - xp} to Level {level + 1}</p>
              </div>
            </div>
            <span className="badge-brand font-bold">Lv.{level}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill bg-gradient-to-r from-brand-500 to-brand-400" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="animate-enter delay-2">
          <h3 className="section-title mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color }, i) => (
              <button key={href} onClick={() => router.push(href)}
                className="card-interactive p-0 overflow-hidden text-left"
                style={{ animationDelay: `${120 + i * 30}ms` }}>
                <div className="p-3.5">
                  <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-2.5`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className="font-display font-bold text-surface-800 text-[13px] leading-tight">{label}</p>
                  <p className="text-surface-400 text-[11px] mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Learning Path ── */}
        <div className="animate-enter delay-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Learning Path</h3>
            <span className="badge-brand text-[11px]">
              {completedIds.length}/{PATH_NODES.length} done
            </span>
          </div>

          <div className="relative card-flat p-5 overflow-hidden">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative space-y-8">
              {PATH_NODES.map((node, i) => (
                <PathNode
                  key={node.id}
                  node={node}
                  index={i}
                  completed={completedIds.includes(node.id)}
                  locked={isNodeLocked(i)}
                  onTap={handlePathTap}
                />
              ))}
            </div>

            {/* End reward */}
            <div className="mt-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-sm">
                <Trophy size={22} className="text-white" />
              </div>
              <p className="mt-2 font-display font-bold text-surface-700 text-sm">Chapter Certificate</p>
              <p className="text-xs text-surface-400">Complete all nodes to earn</p>
            </div>
          </div>
        </div>

        {/* ── Daily Quests ── */}
        <div className="animate-enter delay-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Today's Quests</h3>
            <span className="badge-brand text-[11px]">{questCount}/{DAILY_QUESTS.length}</span>
          </div>
          <div className="space-y-2">
            {DAILY_QUESTS.map(q => {
              const done = !!questsDone[q.id];
              return (
                <button key={q.id}
                  onClick={() => { markQuest(q.id); router.push(q.href); }}
                  className={`w-full quest-card ${done ? 'opacity-50' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    done ? 'bg-success-100' : 'bg-surface-100'
                  }`}>
                    {done
                      ? <CheckCircle2 size={16} className="text-success-500" />
                      : <q.icon size={16} className="text-surface-500" />
                    }
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${done ? 'text-surface-400 line-through' : 'text-surface-800'}`}>
                      {q.title}
                    </p>
                    <p className="text-xs text-brand-500 font-semibold mt-0.5">+{q.xp} XP</p>
                  </div>
                  <ChevronRight size={16} className="text-surface-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Weekly Test Banner ── */}
        <button onClick={() => router.push('/quiz?mode=saturday')}
          className="w-full animate-enter delay-5">
          <div className={`card p-4 relative overflow-hidden active:scale-[.98] transition-all border-0 ${
            isSaturday
              ? 'bg-gradient-to-r from-accent-500 to-rose-500'
              : 'bg-gradient-to-r from-brand-600 to-brand-500'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-display font-bold text-sm">
                  {isSaturday ? 'Saturday Test is Live!' : `Weekly Test in ${daysToSat} day${daysToSat > 1 ? 's' : ''}`}
                </p>
                <p className="text-white/60 text-xs mt-0.5">30 questions · Win XP & badges</p>
              </div>
              <div className="bg-white/15 px-3 py-1.5 rounded-lg text-white text-xs font-bold shrink-0">
                {isSaturday ? 'Start' : 'Remind'}
              </div>
            </div>
          </div>
        </button>

        {/* ── Courses Row ── */}
        <div className="animate-enter delay-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title">Certification Courses</h3>
            <button onClick={() => router.push('/courses')} className="text-xs font-semibold text-brand-600">View All →</button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '🔢', title: 'Math Mastery', chapters: '12 Chapters', color: 'from-brand-500 to-brand-600' },
              { icon: '🧪', title: 'Science Pro',  chapters: '10 Chapters', color: 'from-violet-500 to-violet-600' },
            ].map(c => (
              <button key={c.title} onClick={() => router.push('/courses')}
                className="card-interactive p-0 overflow-hidden text-left">
                <div className={`bg-gradient-to-br ${c.color} p-3 flex items-center gap-2`}>
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <p className="text-white font-display font-bold text-[13px]">{c.title}</p>
                    <p className="text-white/60 text-[10px]">{c.chapters}</p>
                  </div>
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <span className="badge-success text-[10px]">Free</span>
                  <span className="text-2xs text-accent-600 font-semibold flex items-center gap-0.5"><Award size={10} /> Certificate</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <button onClick={() => router.push('/leaderboard')} className="w-full animate-enter delay-6">
          <div className="card flex items-center gap-3.5 p-4 active:scale-[.98] transition-all">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-accent-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-display font-bold text-surface-800 text-sm">Village Leaderboard</p>
              <p className="text-surface-400 text-xs mt-0.5">See your ranking</p>
            </div>
            <ChevronRight size={16} className="text-surface-300" />
          </div>
        </button>

        {/* ── More Tools ── */}
        <div className="animate-enter delay-6">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2.5">More</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { href: '/progress',     icon: '📊', label: 'Progress' },
              { href: '/goals',        icon: '🎯', label: 'Goals'    },
              { href: '/badges',       icon: '🏅', label: 'Badges'   },
              { href: '/certificates', icon: '📜', label: 'Certs'    },
            ].map(({ href, icon, label }) => (
              <button key={href} onClick={() => router.push(href)}
                className="card-interactive p-3 text-center">
                <div className="text-xl mb-1">{icon}</div>
                <p className="text-2xs font-semibold text-surface-600">{label}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}