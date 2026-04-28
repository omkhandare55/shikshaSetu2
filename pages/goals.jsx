// pages/goals.jsx — GraamVidya | Goal-Based Learning
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Target, CheckCircle2, ChevronRight, Zap, Trophy, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

const GOALS = [
  {
    id: 'pass_exam', emoji: '📝', title: 'Pass My Exam',
    desc: 'Focus on must-know topics and practice questions to clear your exam.',
    color: 'from-rose-500 to-pink-600', lightBg: 'bg-rose-50 border-rose-200', textColor: 'text-rose-700',
    tasks: ['Complete all chapter lessons', 'Do Smart Revision daily', 'Take 3 practice quizzes', 'Ask AI Tutor for weak topics'],
    xpReward: 200,
  },
  {
    id: 'improve_english', emoji: '🗣️', title: 'Improve English',
    desc: 'Build spoken and written English skills with voice practice and grammar lessons.',
    color: 'from-emerald-500 to-teal-600', lightBg: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700',
    tasks: ['Complete English Foundations course', 'Do 5 voice practice sessions', 'Learn 10 new words daily', 'Write one short essay this week'],
    xpReward: 150,
  },
  {
    id: 'score_80', emoji: '🏆', title: 'Score 80%+',
    desc: 'Target top marks by mastering every chapter and solving exam-style questions.',
    color: 'from-amber-500 to-orange-600', lightBg: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700',
    tasks: ['Finish all lessons in your class', 'Score 80%+ in Saturday test', 'Complete flashcard review', 'Solve all predicted questions'],
    xpReward: 300,
  },
  {
    id: 'certificate', emoji: '📜', title: 'Earn Certificate',
    desc: 'Complete a full certification course and get your achievement certificate.',
    color: 'from-violet-500 to-indigo-600', lightBg: 'bg-violet-50 border-violet-200', textColor: 'text-violet-700',
    tasks: ['Enroll in a certification course', 'Complete all course chapters', 'Pass the final exam (70%+)', 'Download your certificate'],
    xpReward: 500,
  },
  {
    id: 'scholarship', emoji: '🎓', title: 'Win Scholarship',
    desc: 'Learn about scholarships, prepare for eligibility tests, and apply confidently.',
    color: 'from-brand-500 to-brand-700', lightBg: 'bg-brand-50 border-brand-200', textColor: 'text-brand-700',
    tasks: ['Learn about government scholarships', 'Score 70%+ in Saturday tests', 'Complete English communication course', 'Ask AI Mentor for scholarship guidance'],
    xpReward: 250,
  },
];

function GoalCard({ goal, isActive, onSelect, progress }) {
  return (
    <button onClick={() => onSelect(goal)}
      className={`w-full text-left rounded-3xl overflow-hidden shadow-sm border-2 transition-all active:scale-[.97] ${isActive ? 'border-brand-500 shadow-glow' : 'border-slate-100'}`}>
      <div className={`bg-gradient-to-r ${goal.color} p-5`}>
        <div className="flex items-start justify-between">
          <span className="text-4xl">{goal.emoji}</span>
          {isActive && <span className="bg-white/30 text-white text-xs font-800 px-2.5 py-1 rounded-full">Active ✓</span>}
        </div>
        <p className="text-white font-display font-900 text-lg mt-2">{goal.title}</p>
        <p className="text-white/70 text-xs mt-1">{goal.desc}</p>
      </div>
      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-700 text-slate-500">Progress</p>
          <p className="text-xs font-800 text-brand-600">{progress}%</p>
        </div>
        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-700 text-amber-600 flex items-center gap-1"><Zap size={11} /> +{goal.xpReward} XP on completion</span>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      </div>
    </button>
  );
}

function GoalDetail({ goal, onBack, tasks, completedTasks, onToggle }) {
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  return (
    <div className="px-4 pt-4 pb-8 space-y-5 animate-fade-up">
      <div className={`rounded-3xl p-6 bg-gradient-to-br ${goal.color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <span className="text-5xl block mb-3">{goal.emoji}</span>
          <p className="text-white font-display font-900 text-2xl">{goal.title}</p>
          <p className="text-white/70 text-sm mt-1">{goal.desc}</p>
          <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-white/70 text-xs mt-1">{progress}% completed · +{goal.xpReward} XP on finish</p>
        </div>
      </div>

      <div>
        <p className="font-display font-800 text-slate-700 text-sm mb-3">📋 Goal Checklist</p>
        <div className="space-y-3">
          {tasks.map((task, i) => {
            const done = completedTasks.includes(i);
            return (
              <button key={i} onClick={() => onToggle(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[.98] ${done ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                  {done ? <CheckCircle2 size={16} className="text-white" /> : <span className="text-slate-400 font-700 text-xs">{i + 1}</span>}
                </div>
                <p className={`font-700 text-sm ${done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{task}</p>
              </button>
            );
          })}
        </div>
      </div>

      {progress === 100 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-center animate-fade-up">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-white font-display font-900 text-xl">Goal Achieved!</p>
          <p className="text-white/80 text-sm mt-1">+{goal.xpReward} XP earned! You're amazing!</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 font-700 text-sm">AI Mentor Tip</p>
            <p className="text-blue-600 text-xs mt-1 leading-relaxed">
              Consistency beats intensity. Even 15 minutes daily is better than 2 hours once a week. Keep your streak going! 🔥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeGoal, setActiveGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [goalProgress, setGoalProgress] = useState({});

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      try {
        const saved = JSON.parse(localStorage.getItem(`gv_goals_${user.uid}`) || '{}');
        setActiveGoal(saved.activeGoal || null);
        setGoalProgress(saved.progress || {});
      } catch {}
    }
  }, [user, loading]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    const saved = JSON.parse(localStorage.getItem(`gv_goals_${user.uid}`) || '{}');
    setCompletedTasks(saved.tasks?.[goal.id] || []);
  };

  const handleSetActive = (goal) => {
    setActiveGoal(goal.id);
    const existing = JSON.parse(localStorage.getItem(`gv_goals_${user.uid}`) || '{}');
    localStorage.setItem(`gv_goals_${user.uid}`, JSON.stringify({ ...existing, activeGoal: goal.id }));
    handleSelectGoal(goal);
  };

  const handleToggle = (taskIdx) => {
    const newTasks = completedTasks.includes(taskIdx)
      ? completedTasks.filter(i => i !== taskIdx)
      : [...completedTasks, taskIdx];
    setCompletedTasks(newTasks);
    const existing = JSON.parse(localStorage.getItem(`gv_goals_${user.uid}`) || '{}');
    const newProgress = {
      ...existing,
      tasks: { ...(existing.tasks || {}), [selectedGoal.id]: newTasks },
      progress: { ...(existing.progress || {}), [selectedGoal.id]: Math.round((newTasks.length / selectedGoal.tasks.length) * 100) },
    };
    localStorage.setItem(`gv_goals_${user.uid}`, JSON.stringify(newProgress));
    setGoalProgress(newProgress.progress || {});
  };

  if (selectedGoal) {
    return (
      <AppShell title={`${selectedGoal.emoji} ${selectedGoal.title}`} back onBack={() => setSelectedGoal(null)}>
        <div className="pt-2">
          {activeGoal !== selectedGoal.id && (
            <div className="px-4 pt-3">
              <button onClick={() => handleSetActive(selectedGoal)}
                className="w-full bg-brand-700 text-white font-display font-800 py-3.5 rounded-2xl shadow-glow active:scale-[.97] transition-all">
                🎯 Set as My Active Goal
              </button>
            </div>
          )}
          <GoalDetail
            goal={selectedGoal}
            tasks={selectedGoal.tasks}
            completedTasks={completedTasks}
            onToggle={handleToggle}
            onBack={() => setSelectedGoal(null)}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="🎯 My Goals" back onBack={() => router.push('/home')}>
      <div className="px-4 pt-4 pb-8 space-y-5">

        <div className="rounded-3xl p-5 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <Target size={28} className="text-brand-400 mb-3" />
            <p className="text-white font-display font-900 text-xl">Goal-Based Learning</p>
            <p className="text-slate-400 text-sm mt-1">Set your goal → Get a personalised learning path → Achieve it with AI support</p>
            {activeGoal && (
              <div className="mt-3 bg-brand-600/30 rounded-xl px-3 py-2">
                <p className="text-brand-300 text-xs font-700">Active Goal: {GOALS.find(g => g.id === activeGoal)?.title}</p>
              </div>
            )}
          </div>
        </div>

        <p className="font-display font-800 text-slate-700 text-sm">Choose your goal:</p>
        <div className="space-y-4">
          {GOALS.map((goal, i) => (
            <div key={goal.id} className="animate-pop" style={{ animationDelay: `${i * 60}ms` }}>
              <GoalCard
                goal={goal}
                isActive={activeGoal === goal.id}
                onSelect={handleSelectGoal}
                progress={goalProgress[goal.id] || 0}
              />
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
