// pages/learn/[lessonId].jsx — Full Micro-Lesson Player
// Features: 3-part flow, Marathi/Hindi, Explain Again, Voice read-aloud,
//           MCQ with instant feedback, XP reward, offline save, auto-save.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronRight, ChevronLeft, Volume2, VolumeX, Globe, Lightbulb, CheckCircle2,
  XCircle, AlertTriangle, Zap, Download, RefreshCw, BookOpen, Trophy,
  ArrowLeft, Clock, Star, CheckCheck, Sparkles, Play, Pause,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLessonProgress, saveForOffline, isAvailableOffline } from '../../hooks/useLessonProgress';
import { getLessonById, SUBJECTS } from '../../services/lessonData';
import AppShell from '../../components/layout/AppShell';
import Spinner from '../../components/ui/Spinner';

// ─── Rich text renderer (converts **bold** to <strong>) ───────────────────────
function RichText({ text, className = '' }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-800 text-slate-900">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── Phase progress stepper ────────────────────────────────────────────────────
function PhaseIndicator({ phase }) {
  const phases = [
    { id: 'concept', label: 'Concept', icon: '💡' },
    { id: 'practice', label: 'Practice', icon: '✏️' },
    { id: 'revision', label: 'Revision', icon: '🏆' },
  ];
  const idx = phases.findIndex((p) => p.id === phase);
  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => {
        const isDone = i < idx;
        const isActive = i === idx;
        return (
          <div key={p.id} className="flex items-center">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-800 transition-all duration-300 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow'
                  : isDone
                  ? 'bg-brand-100 text-brand-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{p.icon}</span>
              <span className="hidden xs:inline">{p.label}</span>
            </div>
            {i < phases.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 rounded-full transition-colors ${isDone ? 'bg-brand-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Language toggle ───────────────────────────────────────────────────────────
function LangToggle({ lang, onChange }) {
  const langs = [{ id: 'en', label: 'EN' }, { id: 'mr', label: 'मराठी' }, { id: 'hi', label: 'हिंदी' }];
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5">
      {langs.map((l) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`px-2.5 py-1 rounded-lg text-xs font-700 transition-all duration-200 ${
            lang === l.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

// ─── Concept Phase ────────────────────────────────────────────────────────────
function ConceptPhase({ lesson, onNext, lp, lang, setLang }) {
  const [simplified, setSimplified] = useState(false);
  const [expandedStep, setExpandedStep] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const synthRef = useRef(null);

  const getText = () => {
    if (simplified) {
      return lang === 'mr' ? lesson.concept.simplifiedTextMr : lesson.concept.simplifiedText;
    }
    return lang === 'mr'
      ? lesson.concept.textMr
      : lang === 'hi'
      ? lesson.concept.textHi
      : lesson.concept.text;
  };

  const getStepText = (step) =>
    lang === 'mr' ? step.textMr : step.text;
  const getStepTitle = (step) =>
    lang === 'mr' ? step.titleMr : step.title;

  const readAloud = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const text = getText();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [isReading, lang, simplified]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <LangToggle lang={lang} onChange={setLang} />
        <div className="flex items-center gap-2">
          <button
            onClick={readAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 transition-all duration-200 ${
              isReading
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            {isReading ? <Pause size={12} /> : <Volume2 size={12} />}
            {isReading ? 'Stop' : 'Read Aloud'}
          </button>
        </div>
      </div>

      {/* Explain Again toggle */}
      <button
        onClick={() => setSimplified((s) => !s)}
        className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
          simplified
            ? 'border-amber-400 bg-amber-50'
            : 'border-dashed border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
        }`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${simplified ? 'bg-amber-400' : 'bg-amber-100'}`}>
          <Lightbulb size={18} className={simplified ? 'text-white' : 'text-amber-600'} />
        </div>
        <div className="text-left">
          <p className={`font-display font-800 text-sm ${simplified ? 'text-amber-800' : 'text-slate-700'}`}>
            {simplified ? 'Simplified Explanation (ON)' : 'Explain Again — Simpler!'}
          </p>
          <p className="text-xs text-slate-500">{simplified ? 'Tap to see original explanation' : 'Tap for an easier explanation'}</p>
        </div>
        <div className="ml-auto">
          <div className={`w-10 h-5 rounded-full transition-colors ${simplified ? 'bg-amber-400' : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${simplified ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </div>
      </button>

      {/* Main explanation card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
          <RichText text={getText()} />
        </p>
      </div>

      {/* Step-by-step */}
      <div>
        <p className="font-display font-800 text-slate-700 text-sm mb-3">
          📋 Step-by-Step Guide
        </p>
        <div className="space-y-2">
          {lesson.concept.steps.map((step, i) => {
            const isOpen = expandedStep === i;
            return (
              <button
                key={step.step}
                onClick={() => setExpandedStep(isOpen ? -1 : i)}
                className="w-full text-left"
              >
                <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-brand-300 bg-brand-50' : 'border-slate-100 bg-white hover:border-brand-200'}`}>
                  <div className="flex items-center gap-3 p-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-900 shrink-0 ${isOpen ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {step.step}
                    </div>
                    <p className={`font-700 text-sm flex-1 ${isOpen ? 'text-brand-800' : 'text-slate-700'}`}>
                      {getStepTitle(step)}
                    </p>
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight size={16} className={isOpen ? 'text-brand-500' : 'text-slate-400'} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5">
                      <p className="text-slate-600 text-sm leading-relaxed">{getStepText(step)}</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-display font-800 py-4 rounded-2xl shadow-glow flex items-center justify-center gap-2 active:scale-[.98] transition-transform"
      >
        <span>Continue to Practice</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// ─── Practice Phase (MCQs) ────────────────────────────────────────────────────
function PracticePhase({ lesson, onComplete, lp, lang }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isReading, setIsReading] = useState(false);

  const questions = lesson.practice.questions;
  const q = questions[currentQ];
  const total = questions.length;

  const getQuestion = () => lang === 'mr' ? (q.questionMr || q.question) : q.question;
  const getExplanation = () => lang === 'mr' ? (q.explanationMr || q.explanation) : q.explanation;

  const readQuestion = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isReading) { window.speechSynthesis.cancel(); setIsReading(false); return; }
    const text = getQuestion() + '. Options: ' + q.options.join(', ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.85;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [isReading, lang, q]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    const isCorrect = idx === q.answer;
    setAnswers((prev) => [...prev, { questionId: q.id, selected: idx, correct: isCorrect }]);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < total) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExp(false);
    } else {
      const correct = [...answers].filter((a) => a.correct).length + (selected === q.answer ? 0 : 0);
      // answers already updated
      onComplete(answers);
    }
  };

  // auto-save as questions are answered
  useEffect(() => {
    lp.saveInProgress(lesson.id, 'practice', currentQ);
  }, [currentQ]);

  const optionStyle = (idx) => {
    if (selected === null) {
      return 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50';
    }
    if (idx === q.answer) return 'bg-brand-50 border-brand-400 text-brand-800';
    if (idx === selected && idx !== q.answer) return 'bg-rose-50 border-rose-400 text-rose-800';
    return 'bg-white border-slate-100 text-slate-400';
  };

  const optionIcon = (idx) => {
    if (selected === null) return null;
    if (idx === q.answer) return <CheckCircle2 size={18} className="text-brand-500 shrink-0" />;
    if (idx === selected) return <XCircle size={18} className="text-rose-500 shrink-0" />;
    return null;
  };

  const correctCount = answers.filter((a) => a.correct).length;

  return (
    <div className="space-y-4">
      {/* Q progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-700 text-slate-500">
            Question {currentQ + 1} of {total}
          </p>
          <button onClick={readQuestion} className={`flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-lg transition-colors ${isReading ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:text-indigo-600'}`}>
            {isReading ? <Pause size={10} /> : <Volume2 size={10} />}
            {isReading ? 'Stop' : 'Read'}
          </button>
        </div>
        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ) / total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-brand-600 font-700">{correctCount} correct so far</span>
          <span className="text-[10px] text-slate-400">{total - currentQ - 1} remaining</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <p className="font-display font-800 text-slate-800 text-base leading-snug">
          {getQuestion()}
        </p>
        {lang !== 'en' && q.questionMr && lang === 'mr' && (
          <p className="text-slate-400 text-xs mt-1.5 italic">{q.question}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={selected !== null}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left active:scale-[.99] ${optionStyle(idx)}`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-900 shrink-0 border-2 transition-colors ${
              selected === null
                ? 'border-slate-300 text-slate-500'
                : idx === q.answer
                ? 'border-brand-500 bg-brand-500 text-white'
                : idx === selected
                ? 'border-rose-500 bg-rose-500 text-white'
                : 'border-slate-200 text-slate-300'
            }`}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="font-600 text-sm flex-1">{opt}</span>
            {optionIcon(idx)}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExp && (
        <div className={`rounded-2xl p-4 animate-fade-up ${selected === q.answer ? 'bg-brand-50 border border-brand-200' : 'bg-rose-50 border border-rose-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {selected === q.answer ? (
              <><CheckCircle2 size={16} className="text-brand-500" /><span className="font-800 text-brand-700 text-sm">Correct! 🎉</span></>
            ) : (
              <><XCircle size={16} className="text-rose-500" /><span className="font-800 text-rose-700 text-sm">Not quite!</span></>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{getExplanation()}</p>
        </div>
      )}

      {/* Next / Finish */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-display font-800 py-4 rounded-2xl shadow-glow flex items-center justify-center gap-2 active:scale-[.98] transition-transform animate-fade-up"
        >
          {currentQ + 1 < total ? (
            <><span>Next Question</span><ChevronRight size={20} /></>
          ) : (
            <><span>See Results</span><Trophy size={18} /></>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Revision / Summary Phase ──────────────────────────────────────────────────
function RevisionPhase({ lesson, answers, xpEarned, lang, onRetake, onHome }) {
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const subj = SUBJECTS[lesson.subject];

  const correct = answers.filter((a) => a.correct).length;
  const total = lesson.practice.questions.length;
  const pct = Math.round((correct / total) * 100);
  const isWeak = pct < 60;

  const getPoints = () => lang === 'mr' ? lesson.revision.pointsMr : lesson.revision.points;

  useEffect(() => {
    setIsSavedOffline(isAvailableOffline(lesson.id));
    const t = setTimeout(() => setShowCelebration(true), 300);
    return () => clearTimeout(t);
  }, [lesson.id]);

  const handleDownload = () => {
    saveForOffline(lesson.id, lesson);
    setIsSavedOffline(true);
  };

  const readSummary = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const text = getPoints().join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      {/* Score card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${
        pct >= 80 ? 'from-brand-500 to-brand-700' : pct >= 60 ? 'from-amber-400 to-amber-600' : 'from-rose-400 to-rose-600'
      } shadow-lg relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="relative text-center">
          <div className="text-4xl mb-2">
            {pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}
          </div>
          <p className="text-white/80 text-sm font-700">Your Score</p>
          <p className="text-white font-display font-900 text-5xl mt-1">{pct}%</p>
          <p className="text-white/80 text-sm mt-1">{correct} out of {total} correct</p>

          {/* XP reward */}
          <div className={`mt-4 inline-flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full transition-all duration-700 ${showCelebration ? 'scale-110' : 'scale-100'}`}>
            <Zap size={16} className="text-amber-300" />
            <span className="text-white font-display font-900 text-lg">+{xpEarned} XP</span>
            <Sparkles size={14} className="text-amber-300" />
          </div>

          {isWeak && (
            <p className="text-white/80 text-xs mt-3 flex items-center justify-center gap-1">
              <AlertTriangle size={12} />
              Score below 60% — this topic is marked for revision
            </p>
          )}
        </div>
      </div>

      {/* Quick Revision Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className={`px-5 py-3.5 bg-gradient-to-r ${subj.lightGradient} border-b ${subj.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{subj.icon}</span>
            <p className={`font-display font-800 text-sm ${subj.text}`}>Quick Revision Card</p>
          </div>
          <button
            onClick={readSummary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-700 ${subj.bg} ${subj.text}`}
          >
            <Volume2 size={12} /> Read
          </button>
        </div>
        <div className="p-5 space-y-2.5">
          {getPoints().map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full ${subj.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className={`text-xs font-900 ${subj.text}`}>{i + 1}</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <p className="font-display font-800 text-slate-700 text-sm mb-3">Question Review</p>
        <div className="space-y-2">
          {lesson.practice.questions.map((q, i) => {
            const ans = answers[i];
            const isCorrect = ans?.correct;
            return (
              <div key={q.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${isCorrect ? 'bg-brand-50' : 'bg-rose-50'}`}>
                {isCorrect
                  ? <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
                  : <XCircle size={16} className="text-rose-500 shrink-0" />}
                <p className="text-xs text-slate-700 flex-1 leading-tight line-clamp-2">{q.question}</p>
                {!isCorrect && (
                  <span className="text-[10px] font-700 text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded shrink-0">
                    Ans: {q.options[q.answer]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline download */}
      <button
        onClick={handleDownload}
        disabled={isSavedOffline}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-display font-800 text-sm transition-all ${
          isSavedOffline
            ? 'border-brand-200 bg-brand-50 text-brand-700'
            : 'border-dashed border-slate-300 text-slate-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
        }`}
      >
        {isSavedOffline ? (
          <><CheckCheck size={16} className="text-brand-500" /> Saved for Offline Access</>
        ) : (
          <><Download size={16} /> Save for Offline Access</>
        )}
      </button>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-display font-800 py-3.5 rounded-2xl hover:bg-slate-200 transition-colors active:scale-[.98]"
        >
          <RefreshCw size={16} /> Retake
        </button>
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-display font-800 py-3.5 rounded-2xl shadow-glow active:scale-[.98] transition-transform"
        >
          <BookOpen size={16} /> More Lessons
        </button>
      </div>
    </div>
  );
}

// ─── Main Lesson Player Page ───────────────────────────────────────────────────
export default function LessonPlayerPage() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { user, loading: authLoading } = useAuth();
  const lp = useLessonProgress(user);

  const [lesson, setLesson] = useState(null);
  const [phase, setPhase] = useState('concept');
  const [lang, setLang] = useState('en');
  const [practiceAnswers, setPracticeAnswers] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef(null);

  // Load lesson
  useEffect(() => {
    if (!lessonId) return;
    const l = getLessonById(lessonId);
    if (!l) { router.replace('/learn'); return; }
    setLesson(l);

    // Resume state
    const resume = lp.getResumeState(lessonId);
    if (resume?.phase && resume.phase !== 'concept') {
      setPhase(resume.phase);
    }
  }, [lessonId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace('/');
  }, [user, authLoading, router]);

  // Auto-save phase
  useEffect(() => {
    if (lesson && phase !== 'revision') {
      lp.saveInProgress(lesson.id, phase);
    }
  }, [phase, lesson?.id]);

  if (authLoading || !lesson) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const subj = SUBJECTS[lesson.subject];
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleConceptNext = () => setPhase('practice');

  const handlePracticeComplete = (answers) => {
    setPracticeAnswers(answers);
    const correct = answers.filter((a) => a.correct).length;
    const xp = lp.completeLesson(lesson.id, correct, lesson.practice.questions.length, lesson.xpReward);
    setXpEarned(xp);
    setPhase('revision');
  };

  const handleRetake = () => {
    lp.resetLesson(lesson.id);
    setPracticeAnswers([]);
    setXpEarned(0);
    setElapsedSec(0);
    setPhase('concept');
  };

  const handleHome = () => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    router.push('/learn');
  };

  return (
    <div className="min-h-screen sm:min-h-[100dvh] bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl shadow-slate-300 relative overflow-x-hidden">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3 mb-2.5">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
              router.push('/learn');
            }}
            className="p-1.5 -ml-1 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-display font-900 text-slate-800 text-base truncate">{lesson.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${subj.badge}`}>
                {lesson.subject}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Clock size={9} /> {formatTime(elapsedSec)}
              </span>
              <span className="text-[10px] text-amber-600 font-700 flex items-center gap-0.5">
                <Zap size={9} /> {lesson.xpReward} XP
              </span>
            </div>
          </div>
        </div>
        <PhaseIndicator phase={phase} />
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-5 pb-10">
          {phase === 'concept' && (
            <ConceptPhase
              lesson={lesson}
              onNext={handleConceptNext}
              lp={lp}
              lang={lang}
              setLang={setLang}
            />
          )}
          {phase === 'practice' && (
            <PracticePhase
              lesson={lesson}
              onComplete={handlePracticeComplete}
              lp={lp}
              lang={lang}
            />
          )}
          {phase === 'revision' && (
            <RevisionPhase
              lesson={lesson}
              answers={practiceAnswers}
              xpEarned={xpEarned}
              lang={lang}
              onRetake={handleRetake}
              onHome={handleHome}
            />
          )}
        </div>
      </main>
    </div>
  );
}
