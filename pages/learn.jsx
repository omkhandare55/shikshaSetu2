// pages/learn.jsx — Micro Learning Hub
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BookOpen, Flame, Star, ChevronRight, CheckCircle2, Lock, Play, AlertTriangle,
  Zap, Target, Clock, Download, TrendingUp, Sparkles, BookMarked, BarChart3,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { LESSONS, SUBJECTS, getChapters } from '../services/lessonData';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';

const SUBJECT_TABS = ['All', 'Mathematics', 'Science', 'English'];

function DifficultyBadge({ level }) {
  const map = {
    easy: { label: 'Easy', cls: 'bg-emerald-100 text-emerald-700' },
    medium: { label: 'Medium', cls: 'bg-amber-100 text-amber-700' },
    hard: { label: 'Hard', cls: 'bg-rose-100 text-rose-700' },
  };
  const d = map[level] || map.easy;
  return (
    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${d.cls}`}>{d.label}</span>
  );
}

function ScoreRing({ pct }) {
  const color = pct >= 80 ? 'text-brand-500' : pct >= 60 ? 'text-amber-500' : 'text-rose-500';
  return (
    <div className={`text-center ${color}`}>
      <p className="font-900 text-sm">{pct}%</p>
      <p className="text-[9px] font-600 text-slate-400">Score</p>
    </div>
  );
}

function LessonCard({ lesson, isCompleted, isWeak, score, onStart, resumeState }) {
  const subj = SUBJECTS[lesson.subject];
  const hasResume = !!resumeState;

  return (
    <button
      onClick={onStart}
      className="w-full text-left group"
    >
      <div className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[.98] flex items-center gap-4 ${isWeak ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'}`}>
        {/* Subject icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center text-xl shrink-0`}>
          {subj.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-display font-800 text-slate-800 text-sm leading-tight">{lesson.title}</p>
            {isWeak && <AlertTriangle size={12} className="text-rose-500 shrink-0" />}
          </div>
          <p className="text-[11px] text-slate-400 font-600 mb-1.5">{lesson.chapter}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge level={lesson.difficulty} />
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Clock size={10} /> {lesson.duration} min
            </span>
            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-700">
              <Zap size={10} /> {lesson.xpReward} XP
            </span>
            {hasResume && (
              <span className="text-[10px] text-indigo-600 font-700 bg-indigo-50 px-2 py-0.5 rounded-full">Resume</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0 flex flex-col items-center">
          {isCompleted && score ? (
            <ScoreRing pct={score.pct} />
          ) : isCompleted ? (
            <CheckCircle2 size={22} className="text-brand-500" />
          ) : hasResume ? (
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
              <Play size={16} className="text-white ml-0.5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Play size={16} className="text-slate-400 group-hover:text-white ml-0.5 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ChapterSection({ subject, chapter, lp }) {
  const subj = SUBJECTS[subject];
  const cp = lp.getChapterProgress(subject, chapter.name);
  const weakLessons = lp.getWeakLessons();
  const router = useRouter();

  return (
    <div className="space-y-2">
      {/* Chapter header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="font-display font-800 text-slate-700 text-sm">{chapter.name}</p>
          <p className={`text-xs font-600 ${subj.text}`}>{cp.done}/{cp.total} lessons</p>
        </div>
        {cp.pct === 100 && (
          <span className="text-[10px] font-800 bg-brand-100 text-brand-700 px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Complete
          </span>
        )}
      </div>

      {/* Chapter progress bar */}
      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${subj.color} transition-all duration-700`}
          style={{ width: `${cp.pct}%` }}
        />
      </div>

      {/* Lessons */}
      <div className="space-y-2">
        {chapter.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={lp.isCompleted(lesson.id)}
            isWeak={weakLessons.includes(lesson.id)}
            score={lp.getScore(lesson.id)}
            resumeState={lp.getResumeState(lesson.id)}
            onStart={() => router.push(`/learn/${lesson.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const lp = useLessonProgress(user);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const weakSubjects = lp.getWeakSubjects();
  const weakLessons = lp.getWeakLessons();
  const daily = lp.getDailyRecommendation();

  const subjects = activeTab === 'All'
    ? ['Mathematics', 'Science', 'English']
    : [activeTab];

  return (
    <AppShell
      title="Micro Learning"
      back
      onBack={() => router.push('/home')}
    >
      <div className="px-5 pt-4 pb-6 space-y-5">

        {/* ── Class context banner ── */}
        <div className="animate-fade-up bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-3xl">📚</div>
          <div className="flex-1">
            <p className="text-white font-display font-800 text-sm">Class {user.class || '?'} Lessons</p>
            <p className="text-slate-400 text-xs mt-0.5">Complete lessons to earn XP & level up</p>
          </div>
          <button onClick={() => router.push('/syllabus')}
            className="bg-brand-600 text-white text-xs font-700 px-3 py-1.5 rounded-xl shrink-0">
            Full Syllabus →
          </button>
        </div>

        {/* ── Hero Stats Bar ── */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          {[
            { label: 'Completed', value: lp.totalCompleted, icon: BookMarked, color: 'text-brand-500', bg: 'bg-brand-50' },
            { label: 'XP Earned', value: lp.totalXP, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Weak Topics', value: weakLessons.length, icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${bg} mb-1.5`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`font-900 text-lg font-display ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400 font-600">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Daily Recommendation ── */}
        {daily && (
          <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-500" />
              <p className="font-display font-800 text-slate-700 text-sm">Today's Lesson</p>
            </div>
            <button
              onClick={() => router.push(`/learn/${daily.id}`)}
              className="w-full text-left active:scale-[.98] transition-transform"
            >
              <div className={`rounded-2xl p-5 bg-gradient-to-br ${SUBJECTS[daily.subject].color} relative overflow-hidden shadow-lg`}>
                {/* Decorative dots */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-white/70 text-xs font-700 uppercase tracking-wider">{daily.subject} • {daily.chapter}</span>
                      <p className="text-white font-display font-900 text-lg mt-0.5">{daily.title}</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-2.5">
                      <span className="text-2xl">{SUBJECTS[daily.subject].icon}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Clock size={11} /> {daily.duration} min
                    </span>
                    <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Zap size={11} /> {daily.xpReward} XP
                    </span>
                    {lp.isCompleted(daily.id) && (
                      <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 size={11} /> Done
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-700">
                    {lp.isCompleted(daily.id) ? 'Retake Lesson' : lp.getResumeState(daily.id) ? 'Continue Lesson' : 'Start Lesson'}
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── Weak Topics Alert ── */}
        {weakLessons.length > 0 && (
          <div className="rounded-2xl p-4 bg-rose-50 border border-rose-200 flex items-start gap-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-rose-500" />
            </div>
            <div>
              <p className="font-display font-800 text-rose-800 text-sm">Weak Topics Detected</p>
              <p className="text-xs text-rose-600 mt-0.5">
                You scored below 60% in {weakLessons.length} lesson{weakLessons.length > 1 ? 's' : ''}. Marked with{' '}
                <AlertTriangle size={10} className="inline text-rose-500" /> below — revise these!
              </p>
            </div>
          </div>
        )}

        {/* ── Subject Filter Tabs ── */}
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {SUBJECT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {tab === 'All' ? '📖 All' : `${SUBJECTS[tab]?.icon} ${tab}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Subject & Chapter Lists ── */}
        {subjects.map((subject) => {
          const subj = SUBJECTS[subject];
          const chapters = getChapters(subject);
          if (chapters.length === 0) return null;

          return (
            <div key={subject} className="space-y-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
              {/* Subject header */}
              <div className={`rounded-2xl p-4 bg-gradient-to-r ${subj.lightGradient} border ${subj.border}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{subj.icon}</span>
                  <div>
                    <p className={`font-display font-900 text-base ${subj.text}`}>{subject}</p>
                    <p className="text-xs text-slate-500 font-600">
                      {LESSONS.filter((l) => l.subject === subject && lp.isCompleted(l.id)).length}/
                      {LESSONS.filter((l) => l.subject === subject).length} lessons completed
                    </p>
                  </div>
                  {weakSubjects.includes(subject) && (
                    <span className="ml-auto text-[10px] font-800 bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full">
                      Needs Practice
                    </span>
                  )}
                </div>
                {/* Subject-level progress bar */}
                <div className="mt-3 bg-white/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${subj.color} transition-all duration-700`}
                    style={{
                      width: `${Math.round(
                        (LESSONS.filter((l) => l.subject === subject && lp.isCompleted(l.id)).length /
                          LESSONS.filter((l) => l.subject === subject).length) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Chapters */}
              <div className="space-y-5">
                {chapters.map((chapter) => (
                  <ChapterSection
                    key={chapter.name}
                    subject={subject}
                    chapter={chapter}
                    lp={lp}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AppShell>
  );
}
