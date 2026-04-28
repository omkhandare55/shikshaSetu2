// pages/planner.jsx — AI Study Planner (Weekly + Exam Crash Mode) (i18n)
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Calendar, Zap, CheckCircle2, Circle, Sparkles, ChevronRight,
  Clock, BookOpen, Brain, Target, TrendingUp, RotateCcw, Plus,
  AlertTriangle, Star, Flame, ChevronDown, ChevronUp,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import Spinner from '../components/ui/Spinner';

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'];
const EXAM_DAYS = [3, 5, 7, 10, 14];

const WEEKLY_PLAN_TEMPLATE = [
  {
    day: 'Monday', date: 'Today', icon: '📐',
    tasks: [
      { id: 'w1a', subject: 'Mathematics', topic: 'Quadratic Equations', type: 'Learn', duration: 30, done: false },
      { id: 'w1b', subject: 'Science', topic: 'Ohm\'s Law revision', type: 'Revise', duration: 20, done: false },
      { id: 'w1c', subject: 'English', topic: 'Grammar — Passive Voice', type: 'Practice', duration: 15, done: false },
    ],
  },
  {
    day: 'Tuesday', date: 'Tomorrow', icon: '🔬',
    tasks: [
      { id: 'w2a', subject: 'Science', topic: 'Photosynthesis deep dive', type: 'Learn', duration: 35, done: false },
      { id: 'w2b', subject: 'Mathematics', topic: 'Practice 10 quadratic problems', type: 'Practice', duration: 25, done: false },
      { id: 'w2c', subject: 'Hindi', topic: 'पत्र लेखन अभ्यास', type: 'Practice', duration: 20, done: false },
    ],
  },
  {
    day: 'Wednesday', date: 'In 2 days', icon: '📝',
    tasks: [
      { id: 'w3a', subject: 'English', topic: 'Essay Writing — Environment', type: 'Learn', duration: 30, done: false },
      { id: 'w3b', subject: 'Social Science', topic: 'History — Nationalism', type: 'Learn', duration: 25, done: false },
      { id: 'w3c', subject: 'Mathematics', topic: 'Geometry — Triangles', type: 'Learn', duration: 30, done: false },
    ],
  },
  {
    day: 'Thursday', date: 'In 3 days', icon: '⚡',
    tasks: [
      { id: 'w4a', subject: 'Mathematics', topic: 'Mock Test — Algebra', type: 'Quiz', duration: 40, done: false },
      { id: 'w4b', subject: 'Science', topic: 'Chemistry — Acids & Bases', type: 'Learn', duration: 30, done: false },
      { id: 'w4c', subject: 'English', topic: 'Reading comprehension practice', type: 'Practice', duration: 20, done: false },
    ],
  },
  {
    day: 'Friday', date: 'In 4 days', icon: '🌟',
    tasks: [
      { id: 'w5a', subject: 'Social Science', topic: 'Geography — Resources', type: 'Learn', duration: 25, done: false },
      { id: 'w5b', subject: 'Science', topic: 'Revision — Biology', type: 'Revise', duration: 20, done: false },
      { id: 'w5c', subject: 'Mathematics', topic: 'Statistics chapter', type: 'Learn', duration: 30, done: false },
    ],
  },
  {
    day: 'Saturday', date: 'In 5 days', icon: '🧠',
    tasks: [
      { id: 'w6a', subject: 'Mathematics', topic: 'Full chapter revision — Algebra', type: 'Revise', duration: 45, done: false },
      { id: 'w6b', subject: 'Science', topic: 'Full chapter revision — Physics', type: 'Revise', duration: 35, done: false },
      { id: 'w6c', subject: 'English', topic: 'Vocabulary & Spelling', type: 'Practice', duration: 20, done: false },
    ],
  },
  {
    day: 'Sunday', date: 'In 6 days', icon: '✅',
    tasks: [
      { id: 'w7a', subject: 'All Subjects', topic: 'Full Mock Test — All subjects', type: 'Quiz', duration: 60, done: false },
      { id: 'w7b', subject: 'Mathematics', topic: 'Weak areas revision', type: 'Revise', duration: 30, done: false },
    ],
  },
];

function buildCrashPlan(days, subjects) {
  const plan = [];
  const subjectList = subjects.length > 0 ? subjects : ['Mathematics', 'Science', 'English'];
  for (let d = 0; d < days; d++) {
    const dayNum = d + 1;
    const isLastDay = d === days - 1;
    const subj = subjectList[d % subjectList.length];
    const subj2 = subjectList[(d + 1) % subjectList.length];
    plan.push({
      day: `Day ${dayNum}`,
      date: dayNum === 1 ? 'Today' : dayNum === 2 ? 'Tomorrow' : `In ${d} days`,
      icon: isLastDay ? '🎯' : d % 2 === 0 ? '📝' : '⚡',
      tasks: isLastDay
        ? [
            { id: `c${d}a`, subject: 'All Subjects', topic: 'Final Mock Test (Full Syllabus)', type: 'Quiz', duration: 90, done: false },
            { id: `c${d}b`, subject: 'All Subjects', topic: 'Review wrong answers & weak points', type: 'Revise', duration: 30, done: false },
          ]
        : [
            { id: `c${d}a`, subject: subj, topic: `${subj} — High-probability topics`, type: 'Revise', duration: 40, done: false },
            { id: `c${d}b`, subject: subj2, topic: `${subj2} — Predicted questions practice`, type: 'Practice', duration: 30, done: false },
            { id: `c${d}c`, subject: subj, topic: `${subj} — Flash cards & quick notes`, type: 'Learn', duration: 20, done: false },
          ],
    });
  }
  return plan;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  Learn: { bg: 'bg-blue-100', text: 'text-blue-700', icon: BookOpen },
  Revise: { bg: 'bg-amber-100', text: 'text-amber-700', icon: RotateCcw },
  Practice: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Brain },
  Quiz: { bg: 'bg-rose-100', text: 'text-rose-700', icon: Target },
};

const SUBJ_COLORS = {
  Mathematics: 'text-blue-500',
  Science: 'text-emerald-500',
  English: 'text-purple-500',
  'Social Science': 'text-amber-500',
  Hindi: 'text-rose-500',
  'All Subjects': 'text-slate-500',
};

function TaskRow({ task, onToggle, t }) {
  const style = TYPE_STYLE[task.type] || TYPE_STYLE.Learn;
  const TypeIcon = style.icon;
  const subjColor = SUBJ_COLORS[task.subject] || 'text-slate-500';

  const translatedType = task.type === 'Learn' ? t('plan_learn') :
                         task.type === 'Revise' ? t('plan_revise') :
                         task.type === 'Practice' ? t('plan_practice') :
                         t('plan_quiz');

  return (
    <button
      onClick={() => onToggle(task.id)}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all active:scale-[.98] ${
        task.done ? 'opacity-60 bg-slate-50' : 'bg-white hover:bg-slate-50'
      }`}
    >
      {task.done
        ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
        : <Circle size={20} className="text-slate-300 shrink-0 mt-0.5" />
      }
      <div className="flex-1 min-w-0">
        <p className={`font-700 text-sm leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.topic}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[10px] font-700 ${subjColor}`}>{task.subject}</span>
          <span className={`text-[10px] font-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${style.bg} ${style.text}`}>
            <TypeIcon size={9} /> {translatedType}
          </span>
          <span className="text-[10px] text-slate-400 font-600 flex items-center gap-0.5">
            <Clock size={9} /> {task.duration}m
          </span>
        </div>
      </div>
    </button>
  );
}

function DayCard({ dayPlan, onToggle, t, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const totalMin = dayPlan.tasks.reduce((a, t) => a + t.duration, 0);
  const doneCount = dayPlan.tasks.filter(t => t.done).length;
  const allDone = doneCount === dayPlan.tasks.length;

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all ${allDone ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-white'} shadow-sm`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="text-xl">{dayPlan.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-display font-800 text-slate-800 text-base">{dayPlan.day}</p>
            {allDone && <CheckCircle2 size={16} className="text-emerald-500" />}
          </div>
          <p className="text-xs text-slate-400 font-600">
            {dayPlan.date} • {t('plan_tasksDone', { done: doneCount, total: dayPlan.tasks.length })} • {totalMin}m
          </p>
        </div>
        <div className="flex gap-1 mr-2">
          {dayPlan.tasks.map(t => (
            <div key={t.id} className={`w-1.5 h-5 rounded-full ${t.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          ))}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-1.5 border-t border-slate-100">
          {dayPlan.tasks.map(task => (
            <TaskRow key={task.id} task={task} onToggle={onToggle} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PlannerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState(null); // null | 'weekly' | 'crash' | 'setup'
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Crash setup
  const [examDays, setExamDays] = useState(7);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (s) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleTask = (taskId) => {
    setPlan(prev => prev.map(day => ({
      ...day,
      tasks: day.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
    })));
  };

  const generateWeeklyPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan(WEEKLY_PLAN_TEMPLATE.map(day => ({ ...day, tasks: day.tasks.map(t => ({ ...t, done: false })) })));
      setMode('weekly');
      setLoading(false);
    }, 1800);
  };

  const generateCrashPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan(buildCrashPlan(examDays, selectedSubjects));
      setMode('crash');
      setLoading(false);
    }, 1800);
  };

  const totalTasks = plan ? plan.reduce((a, d) => a + d.tasks.length, 0) : 0;
  const doneTasks = plan ? plan.reduce((a, d) => a + d.tasks.filter(t => t.done).length, 0) : 0;
  const totalMin = plan ? plan.reduce((a, d) => a + d.tasks.reduce((b, t) => b + t.duration, 0), 0) : 0;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => mode ? (setPlan(null); setMode(null)) : router.back()}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <h2 className="font-display font-900 text-2xl text-slate-900 leading-tight">{t('plan_title')}</h2>
              <p className="text-sm font-500 text-slate-500">
                {mode === 'weekly' ? t('plan_subWeekly') : mode === 'crash' ? t('plan_subCrash', { n: examDays }) : t('plan_subDefault')}
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
            <Calendar size={24} className="text-amber-600" />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-up">
            <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
              <Sparkles size={36} className="text-brand-500 animate-pulse" />
            </div>
            <p className="font-display font-800 text-slate-800 text-xl mb-2">{t('plan_loading')}</p>
            <p className="text-sm text-slate-500 text-center">{t('plan_loadingSub')}</p>
          </div>
        )}

        {!mode && !loading && (
          <div className="space-y-5 animate-fade-up">
            <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg overflow-hidden relative">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -right-4 top-8 w-20 h-20 bg-white/10 rounded-full" />
              <div className="relative">
                <p className="text-amber-100 text-sm font-700 mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> AI Study Planner
                </p>
                <h3 className="text-white font-display font-900 text-2xl mb-2">{t('plan_heroTitle')}</h3>
                <p className="text-amber-100 text-sm leading-relaxed">{t('plan_heroDesc')}</p>
              </div>
            </div>

            <h3 className="font-display font-800 text-slate-700 text-base">{t('plan_chooseType')}</h3>

            <button onClick={generateWeeklyPlan} className="w-full text-left">
              <div className="card p-5 flex items-start gap-4 active:scale-[.98] transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                  <Calendar size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-800 text-xl text-slate-800">{t('plan_weeklyTitle')}</p>
                  <p className="text-sm text-slate-500 font-500 mt-1">{t('plan_weeklyDesc')}</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 shrink-0 mt-1" />
              </div>
            </button>

            <button onClick={() => setMode('setup')} className="w-full text-left">
              <div className="card p-5 flex items-start gap-4 active:scale-[.98] transition-all hover:-translate-y-0.5 hover:shadow-md border-l-4 border-rose-400">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <Zap size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-800 text-xl text-slate-800">{t('plan_crashTitle')}</p>
                  <p className="text-sm text-slate-500 font-500 mt-1">{t('plan_crashDesc')}</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 shrink-0 mt-1" />
              </div>
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-blue-600" />
                <p className="font-display font-800 text-blue-800 text-sm">{t('plan_tips')}</p>
              </div>
              <ul className="space-y-1.5">
                {[t('plan_tip1'), t('plan_tip2'), t('plan_tip3')].map((tip, i) => (
                  <li key={i} className="text-xs text-blue-700 font-600 flex gap-2 items-start">
                    <span className="text-blue-400 mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {mode === 'setup' && !loading && (
          <div className="space-y-5 animate-fade-up">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg">
              <h3 className="text-white font-display font-900 text-2xl">{t('plan_setupTitle')}</h3>
            </div>

            <div className="card p-5 space-y-5">
              <div>
                <label className="block font-display font-800 text-slate-700 text-sm mb-3">{t('plan_daysQ')}</label>
                <div className="flex gap-2 flex-wrap">
                  {EXAM_DAYS.map(d => (
                    <button key={d} onClick={() => setExamDays(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-800 transition-all ${examDays === d ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}>
                      {t('plan_days', { n: d })}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-display font-800 text-slate-700 text-sm mb-3">{t('plan_subjQ')}</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(subj => (
                    <button key={subj} onClick={() => toggleSubject(subj)}
                      className={`px-3 py-2 rounded-xl text-xs font-800 transition-all ${selectedSubjects.includes(subj) ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generateCrashPlan}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl py-4 font-display font-800 text-base flex items-center justify-center gap-2 active:scale-[.98] transition-transform shadow-lg">
                <Sparkles size={18} /> {t('plan_generate', { n: examDays })}
              </button>
            </div>
          </div>
        )}

        {(mode === 'weekly' || mode === 'crash') && plan && !loading && (
          <div className="space-y-5 animate-fade-up">
            <div className={`rounded-2xl p-5 ${mode === 'crash' ? 'bg-gradient-to-br from-rose-500 to-rose-700' : 'bg-gradient-to-br from-brand-500 to-brand-700'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-xs font-700 uppercase tracking-wider">{mode === 'crash' ? '⚡ Crash Plan' : '📅 Weekly Plan'}</p>
                  <p className="text-white font-display font-900 text-2xl mt-0.5">{t('plan_progress', { pct: progressPct })}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-display font-900 text-xl">{doneTasks}/{totalTasks}</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              {plan.map((dayPlan, i) => <DayCard key={dayPlan.day} dayPlan={dayPlan} onToggle={toggleTask} defaultOpen={i === 0} t={t} />)}
            </div>

            <button onClick={() => { setPlan(null); setMode(mode === 'crash' ? 'setup' : null); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-700 text-sm hover:border-brand-400 hover:text-brand-600 transition-colors">
              <RotateCcw size={16} /> {t('plan_regen')}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
