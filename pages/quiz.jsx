// pages/quiz.jsx — GraamVidya | Smart Quiz + Saturday Weekly Test
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import {
  Trophy, Zap, Clock, CheckCircle2, XCircle, ChevronRight,
  RotateCcw, BookOpen, Target, Star, ArrowRight, Brain,
} from 'lucide-react';

// ── Quiz Data ────────────────────────────────────────────────────────────────
const DAILY_QUESTIONS = [
  {
    id: 1, subject: 'Math',
    q: 'If x² - 5x + 6 = 0, what are the roots?',
    options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 5, x = 1'],
    correct: 0,
    explanation: 'Factorising: (x-2)(x-3) = 0, so x = 2 or x = 3.',
  },
  {
    id: 2, subject: 'Science',
    q: 'What is the chemical formula for water?',
    options: ['H₂O', 'CO₂', 'NaCl', 'O₂'],
    correct: 0,
    explanation: 'Water is H₂O — two Hydrogen atoms and one Oxygen atom.',
  },
  {
    id: 3, subject: 'English',
    q: 'Change to passive voice: "The teacher solved the problem."',
    options: [
      'The problem was solved by the teacher.',
      'The problem is solving by the teacher.',
      'The teacher was solved by the problem.',
      'The problem solved by the teacher.',
    ],
    correct: 0,
    explanation: 'Passive: The problem was solved by the teacher. (past passive: was + past participle)',
  },
  {
    id: 4, subject: 'Science',
    q: 'Photosynthesis equation: which gas is RELEASED?',
    options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Hydrogen (H₂)'],
    correct: 0,
    explanation: '6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂. Oxygen is the byproduct.',
  },
  {
    id: 5, subject: 'Math',
    q: 'The value of sin 30° is:',
    options: ['1/2', '√3/2', '1', '0'],
    correct: 0,
    explanation: 'sin 30° = 1/2. Remember: sin 0°=0, sin 30°=½, sin 45°=√2/2, sin 60°=√3/2, sin 90°=1.',
  },
  {
    id: 6, subject: 'Social Studies',
    q: 'The Indian Constitution came into effect on:',
    options: ['26 January 1950', '15 August 1947', '26 November 1949', '2 October 1950'],
    correct: 0,
    explanation: 'The Constitution was adopted on 26 Nov 1949 and came into effect on 26 January 1950 — now celebrated as Republic Day.',
  },
  {
    id: 7, subject: 'English',
    q: 'Which sentence uses the correct punctuation?',
    options: [
      "It's a sunny day.",
      "Its a sunny day.",
      "It's a sunny, day.",
      "Its' a sunny day.",
    ],
    correct: 0,
    explanation: '"It\'s" = "It is" (contraction, needs apostrophe). "Its" = possessive (no apostrophe).',
  },
  {
    id: 8, subject: 'Math',
    q: 'Area of a circle with radius r is:',
    options: ['πr²', '2πr', 'πr', '2πr²'],
    correct: 0,
    explanation: 'Area = πr². Circumference = 2πr. Remember: Area has r², circumference has r.',
  },
  {
    id: 9, subject: 'Science',
    q: "Ohm's Law states that V =",
    options: ['I × R', 'I / R', 'I + R', 'I - R'],
    correct: 0,
    explanation: "V = I × R (Voltage = Current × Resistance). This is Ohm's Law.",
  },
  {
    id: 10, subject: 'Math',
    q: 'HCF of 12 and 18 is:',
    options: ['6', '3', '12', '36'],
    correct: 0,
    explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Highest common = 6.',
  },
];

const SATURDAY_QUESTIONS = [
  ...DAILY_QUESTIONS,
  { id: 11, subject: 'Science', q: 'The powerhouse of the cell is:', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'], correct: 0, explanation: 'Mitochondria produce ATP (energy) through cellular respiration — hence "powerhouse of the cell".' },
  { id: 12, subject: 'Math', q: 'Sum of angles in a triangle is:', options: ['180°', '360°', '90°', '270°'], correct: 0, explanation: 'The angle sum property: all three angles of any triangle always add up to 180°.' },
  { id: 13, subject: 'English', q: 'Antonym of "Transparent" is:', options: ['Opaque', 'Clear', 'Bright', 'Shiny'], correct: 0, explanation: '"Opaque" means cannot see through — the opposite of transparent.' },
  { id: 14, subject: 'Social', q: 'Which river is the longest in India?', options: ['Ganga', 'Yamuna', 'Godavari', 'Brahmaputra'], correct: 0, explanation: 'The Ganga (Ganges) is the longest river entirely within India at about 2,525 km.' },
  { id: 15, subject: 'Math', q: 'The value of π (pi) is approximately:', options: ['3.14', '3.41', '2.14', '3.15'], correct: 0, explanation: 'π ≈ 3.14159... commonly rounded to 3.14 or expressed as 22/7.' },
];

const SUBJECT_COLORS = {
  Math: 'bg-brand-100 text-brand-700',
  Science: 'bg-indigo-100 text-indigo-700',
  English: 'bg-emerald-100 text-emerald-700',
  'Social Studies': 'bg-amber-100 text-amber-700',
  Social: 'bg-amber-100 text-amber-700',
};

// ── Timer Component ───────────────────────────────────────────────────────────
function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 30;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${isLow ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
      <Clock size={14} />
      <span className="font-display font-800 text-sm">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ score, total, answers, questions, mode, onRetry, onHome }) {
  const pct = Math.round((score / total) * 100);
  const xpEarned = score * (mode === 'saturday' ? 5 : 3);
  const grade = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good Job!' : pct >= 40 ? '📚 Keep Practicing' : '💪 Don\'t Give Up!';

  return (
    <div className="px-4 pt-6 pb-8 space-y-5 animate-fade-up">
      {/* Score card */}
      <div className={`rounded-3xl p-6 text-center relative overflow-hidden ${pct >= 60 ? 'bg-gradient-to-br from-brand-600 to-indigo-700' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-900 text-white text-3xl">{pct}%</span>
          </div>
          <p className="text-white font-display font-900 text-2xl">{grade}</p>
          <p className="text-white/70 text-sm mt-1">{score} / {total} correct answers</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-amber-300 font-display font-900 text-xl">+{xpEarned}</p>
              <p className="text-white/60 text-xs">XP earned</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-white font-display font-900 text-xl">{score}</p>
              <p className="text-white/60 text-xs">Correct</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-rose-300 font-display font-900 text-xl">{total - score}</p>
              <p className="text-white/60 text-xs">Wrong</p>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement tips */}
      {pct < 60 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-display font-800 text-amber-800 text-sm mb-2">💡 Improvement Tips</p>
          <ul className="space-y-1.5">
            {['Revise the chapters where you answered wrong', 'Use Smart Revision for quick review', 'Ask AI Tutor for concept explanations'].map(tip => (
              <li key={tip} className="text-amber-700 text-xs font-600 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Answer review */}
      <div>
        <p className="font-display font-800 text-slate-700 text-sm mb-3">📋 Answer Review</p>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.correct;
            return (
              <div key={q.id} className={`rounded-2xl p-4 border ${correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {correct ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />}
                  <p className="text-slate-800 text-sm font-700 leading-snug">{q.q}</p>
                </div>
                <p className={`text-xs font-700 ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Your answer: {q.options[userAns ?? -1] ?? 'Skipped'}
                </p>
                {!correct && (
                  <p className="text-xs font-700 text-emerald-700 mt-0.5">
                    Correct: {q.options[q.correct]}
                  </p>
                )}
                <p className="text-xs text-slate-500 font-600 mt-2 leading-relaxed">
                  💡 {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white font-display font-800 py-4 rounded-2xl shadow-glow active:scale-95 transition-all">
          <RotateCcw size={18} /> Retry Quiz
        </button>
        <button onClick={onHome}
          className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-700 py-3.5 rounded-2xl border border-slate-200 active:scale-95 transition-all">
          <BookOpen size={16} /> Go to Home
        </button>
      </div>
    </div>
  );
}

// ── Main Quiz Page ────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { mode } = router.query;

  const [phase, setPhase]     = useState('intro'); // intro | quiz | results
  const [questions, setQs]    = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore]     = useState(0);

  const isSaturday = mode === 'saturday';
  const QUESTIONS  = isSaturday ? SATURDAY_QUESTIONS : DAILY_QUESTIONS;
  const QUIZ_TIME  = isSaturday ? 30 * 60 : 10 * 60; // 30min saturday, 10min daily

  useEffect(() => { if (!loading && !user) router.replace('/'); }, [user, loading]);

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); finishQuiz(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const startQuiz = () => {
    setQs(QUESTIONS);
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setShowExp(false);
    setTimeLeft(QUIZ_TIME);
    setPhase('quiz');
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => ({ ...prev, [current]: idx }));
    setShowExp(true);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExp(false);
    }
  };

  const finishQuiz = useCallback(() => {
    const sc = Object.entries(answers).filter(([i, a]) => questions[+i]?.correct === a).length;
    setScore(sc);
    const xpEarned = sc * (isSaturday ? 5 : 3);
    try {
      const prog = JSON.parse(localStorage.getItem(`gv_progress_${user?.uid}`) || '{}');
      localStorage.setItem(`gv_progress_${user?.uid}`, JSON.stringify({
        ...prog,
        xp: (prog.xp || 0) + xpEarned,
        questionsSolved: (prog.questionsSolved || 0) + questions.length,
      }));
    } catch {}
    setPhase('results');
  }, [answers, questions, isSaturday, user]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const q = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <AppShell title={isSaturday ? '📅 Saturday Test' : '🧠 Daily Quiz'} back onBack={() => router.push('/home')}>

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="px-4 pt-6 pb-8 space-y-5 animate-fade-up">
          <div className={`rounded-3xl p-6 relative overflow-hidden ${isSaturday ? 'bg-gradient-to-br from-saffron-500 to-rose-600' : 'bg-gradient-to-br from-brand-600 to-indigo-700'}`}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '18px 18px' }} />
            <div className="relative text-center">
              <div className="text-6xl mb-4">{isSaturday ? '📅' : '🧠'}</div>
              <h2 className="text-white font-display font-900 text-2xl mb-2">
                {isSaturday ? 'Weekly Practice Test' : 'Daily Quiz'}
              </h2>
              <p className="text-white/70 text-sm mb-4">{isSaturday ? 'Test your week\'s learning!' : 'Quick 10-question daily challenge'}</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-white font-900 text-xl font-display">{QUESTIONS.length}</p>
                  <p className="text-white/60 text-xs">Questions</p>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-white font-900 text-xl font-display">{isSaturday ? '30' : '10'}</p>
                  <p className="text-white/60 text-xs">Minutes</p>
                </div>
                <div className="w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-amber-300 font-900 text-xl font-display">+{QUESTIONS.length * (isSaturday ? 5 : 3)}</p>
                  <p className="text-white/60 text-xs">Max XP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {['All questions from verified syllabus content', 'Step-by-step explanations after each answer', 'Score report with improvement tips'].map(f => (
              <div key={f} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <p className="text-slate-700 text-sm font-600">{f}</p>
              </div>
            ))}
          </div>

          <button onClick={startQuiz}
            className={`w-full py-4 rounded-2xl font-display font-800 text-lg text-white shadow-lg active:scale-[.97] transition-all ${isSaturday ? 'bg-saffron-500 shadow-glow-saffron' : 'bg-brand-700 shadow-glow'}`}>
            🚀 Start {isSaturday ? 'Weekly Test' : 'Daily Quiz'}
          </button>
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase === 'quiz' && q && (
        <div className="px-4 pt-4 pb-8 space-y-5">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="font-display font-800 text-slate-600 text-sm">
              {current + 1} / {questions.length}
            </span>
            <Timer seconds={timeLeft} />
            <span className={`text-xs font-700 px-2.5 py-1 rounded-full ${SUBJECT_COLORS[q.subject] || 'bg-slate-100 text-slate-500'}`}>
              {q.subject}
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 min-h-[120px] flex items-center">
            <p className="font-display font-800 text-slate-800 text-lg leading-snug text-center w-full">{q.q}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect  = i === q.correct;
              let cls = 'bg-white border-slate-200 text-slate-800';
              if (selected !== null) {
                if (isCorrect) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                else if (isSelected) cls = 'bg-rose-50 border-rose-400 text-rose-800';
                else cls = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[.98] ${cls}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-display font-900 text-sm ${selected !== null && isCorrect ? 'bg-emerald-500 text-white' : selected !== null && isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {selected !== null && isCorrect ? <CheckCircle2 size={16} /> : selected !== null && isSelected ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
                  </div>
                  <p className="font-600 text-sm leading-snug">{opt}</p>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExp && (
            <div className={`rounded-2xl p-4 animate-fade-up ${selected === q.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
              <p className={`font-700 text-sm mb-1 ${selected === q.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                {selected === q.correct ? '✅ Correct!' : '❌ Wrong'}
              </p>
              <p className="text-slate-600 text-xs font-600 leading-relaxed">💡 {q.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {selected !== null && (
            <button onClick={nextQuestion}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white font-display font-800 py-4 rounded-2xl shadow-glow active:scale-95 transition-all animate-fade-up">
              {current + 1 >= questions.length ? '📊 See Results' : 'Next Question'}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <ResultsScreen
          score={score}
          total={questions.length}
          answers={answers}
          questions={questions}
          mode={mode}
          onRetry={startQuiz}
          onHome={() => router.push('/home')}
        />
      )}
    </AppShell>
  );
}