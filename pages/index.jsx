// pages/index.jsx — GraamVidya | Professional Onboarding
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, ArrowLeft, MapPin, Check, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, handleRedirectResult, registerWithEmail, loginWithEmail } from '../services/firebase';

// ── Constants ──────────────────────────────────────────────────
const LANGUAGES = [
  { value: 'marathi', label: 'मराठी',  desc: 'Marathi Medium' },
  { value: 'hindi',   label: 'हिंदी',   desc: 'Hindi Medium'   },
  { value: 'english', label: 'English', desc: 'English Medium'  },
];

const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];

const GOALS = [
  { value: 'board',       emoji: '📝', label: 'Board Exam Prep'      },
  { value: 'top_rank',    emoji: '🏆', label: 'Top My Class'          },
  { value: 'scholarship', emoji: '🎓', label: 'Win Scholarship'       },
  { value: 'skill',       emoji: '💡', label: 'Learn New Skills'      },
  { value: 'certificate', emoji: '📜', label: 'Earn Certificates'     },
  { value: 'fun',         emoji: '⚡', label: 'Explore & Grow'        },
];

const FEATURES = [
  { icon: '📚', title: 'Free Courses',     desc: 'All classes, always free'   },
  { icon: '🤖', title: 'AI Mentor',        desc: 'Ask doubts in your language' },
  { icon: '🏆', title: 'XP & Badges',      desc: 'Earn rewards as you learn' },
  { icon: '📜', title: 'Certificates',     desc: 'Prove your knowledge'       },
];

// ── Local Storage helpers ──────────────────────────────────────
const DB_KEY = 'gv_students';
function getDB() { try { return JSON.parse(localStorage.getItem(DB_KEY)||'{}'); } catch { return {}; } }
function saveUser(email, data) {
  const db = getDB(); db[email.toLowerCase()] = data;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
function findUser(email, pw) {
  const u = getDB()[email.toLowerCase()];
  if (!u) return { err: 'Account not found. Please register.' };
  if (u.password !== pw) return { err: 'Wrong password!' };
  return { user: u };
}
function setSession(data) {
  localStorage.setItem('gv_session', JSON.stringify(data));
  localStorage.setItem('ss_manual_user', JSON.stringify(data));
}

// ── Main Component ─────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]     = useState('welcome');
  const [lang, setLang]     = useState('');
  const [mode, setMode]     = useState('register');
  const [name, setName]     = useState('');
  const [village, setVillage] = useState('');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [showPw, setShowPw] = useState(false);
  const [cls, setCls]       = useState('');
  const [goal, setGoal]     = useState('');
  const [err, setErr]       = useState('');
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('gv_session')||'null');
      if (s?.uid) router.replace('/home');
    } catch {}

    // Handle Google sign-in redirect result
    handleRedirectResult().then(user => {
      if (user) {
        setSession({
          uid: user.uid, email: user.email, name: user.displayName,
          photo: user.photoURL, source: 'google',
        });
        router.push('/home');
      }
    });
  }, []);

  const go = (s) => { setErr(''); setStep(s); };

  // ── Google sign-in ─────────────────────────────
  const handleGoogle = async () => {
    setErr(''); setGLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setSession({
          uid: user.uid, email: user.email, name: user.displayName,
          photo: user.photoURL, source: 'google',
        });
        router.push('/home');
      }
      // if null, redirect is happening
    } catch (e) {
      console.error('Google sign-in error:', e);
      const code = e?.code || '';
      if (code === 'auth/unauthorized-domain') {
        setErr('Add localhost to Firebase Auth → Settings → Authorized domains.');
      } else if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
        setErr('Enable Google sign-in in Firebase Console → Authentication → Sign-in method.');
      } else if (code === 'auth/internal-error') {
        setErr('Firebase error. Check if Google sign-in is enabled in Firebase Console.');
      } else {
        setErr(`Google sign-in failed (${code || e.message}). Try email instead.`);
      }
    } finally { setGLoading(false); }
  };

  // ── Email auth ─────────────────────────────────
  const handleAuth = async () => {
    setErr('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Enter a valid email address.');
    if (pw.length < 6) return setErr('Password must be at least 6 characters.');

    if (mode === 'login') {
      try {
        const user = await loginWithEmail(email, pw);
        setSession({ uid: user.uid, email: user.email, name: user.displayName, source: 'email' });
        router.push('/home');
      } catch (e) {
        // Fallback to local auth
        const res = findUser(email, pw);
        if (res.err) return setErr(res.err);
        const { password: _, ...ud } = res.user;
        setSession(ud); router.push('/home');
      }
    } else {
      if (!name.trim()) return setErr('Enter your name.');
      go('class');
    }
  };

  // ── Finish registration ────────────────────────
  const handleFinish = async () => {
    if (!cls) return setErr('Select your class!');
    const userData = {
      uid: `gv_${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      village: village.trim() || 'My Village',
      class: cls, language: lang, goal, role: 'student',
      xp: 0, streak: 0, level: 1, joinedAt: Date.now(),
    };

    try {
      const user = await registerWithEmail(email, pw, name.trim());
      userData.uid = user.uid;
    } catch (e) {
      // Firebase registration failed, use local
      console.log('Firebase register fallback to local:', e.message);
    }

    saveUser(email, { ...userData, password: pw });
    setSession(userData);
    router.push('/home');
  };

  // ── Step Progress ──────────────────────────────
  const STEPS = ['lang','auth','class','goal'];
  const stepIdx = STEPS.indexOf(step);

  const StepBar = () => stepIdx >= 0 ? (
    <div className="flex gap-1.5 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          i <= stepIdx ? 'bg-brand-500' : 'bg-surface-200'
        }`} />
      ))}
    </div>
  ) : null;

  const BackBtn = ({ to }) => (
    <button onClick={() => go(to)} className="flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-surface-700 mb-6 transition-colors">
      <ArrowLeft size={16} /> Back
    </button>
  );

  const ErrorMsg = () => err ? (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-3.5 py-2.5 rounded-xl mt-3 animate-enter">
      <span className="shrink-0">⚠</span>
      <span>{err}</span>
    </div>
  ) : null;

  // ═══════════════════════════════════════════════════════════════
  // WELCOME SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (step === 'welcome') return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-between px-5 py-10 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Gradient orbs */}
      <div className="absolute top-20 -right-20 w-64 h-64 bg-brand-600/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-40 -left-20 w-48 h-48 bg-accent-500/15 rounded-full blur-[60px]" />

      {/* Logo */}
      <div className="text-center animate-enter w-full relative z-10">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-elevated flex items-center justify-center mx-auto mb-5">
          <span className="font-display font-extrabold text-brand-600 text-xl tracking-tighter">GV</span>
        </div>
        <h1 className="font-display font-extrabold text-white text-3xl tracking-tight">GraamVidya</h1>
        <p className="text-surface-400 text-sm mt-2 font-medium">ग्राम विद्या · Your Learning Journey Starts Here</p>
      </div>

      {/* Feature cards */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 my-8 relative z-10">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="animate-enter bg-white/[0.06] rounded-xl px-3.5 py-3 border border-white/[0.08]"
            style={{ animationDelay: `${60 + i * 40}ms` }}>
            <span className="text-lg">{f.icon}</span>
            <p className="text-white text-[13px] font-semibold mt-1.5 leading-tight">{f.title}</p>
            <p className="text-surface-400 text-[11px] mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full max-w-sm space-y-3 relative z-10 animate-enter" style={{ animationDelay: '200ms' }}>
        <button onClick={() => { setMode('register'); go('lang'); }}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-display font-bold text-[15px] py-3.5 rounded-xl shadow-glow active:scale-[.97] transition-all flex items-center justify-center gap-2">
          Get Started Free <ArrowRight size={18} />
        </button>
        <button onClick={() => { setMode('login'); go('auth'); }}
          className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white/80 font-semibold py-3 rounded-xl border border-white/[0.1] active:scale-[.97] transition-all text-sm">
          Already a learner? Log In
        </button>
        <p className="text-surface-500 text-[11px] text-center mt-3">
          Free forever · No school required · Made for rural India
        </p>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: LANGUAGE
  // ═══════════════════════════════════════════════════════════════
  if (step === 'lang') return (
    <div className="min-h-screen bg-surface-50 flex flex-col px-5 pt-10 pb-8 max-w-md mx-auto">
      <StepBar />
      <BackBtn to="welcome" />

      <div className="mb-8">
        <h2 className="font-display font-extrabold text-2xl text-surface-900 tracking-tight">Choose your language</h2>
        <p className="text-surface-400 text-sm mt-1.5">App content will be in your chosen language</p>
      </div>

      <div className="space-y-3 flex-1">
        {LANGUAGES.map(l => (
          <button key={l.value} onClick={() => setLang(l.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 active:scale-[.98] ${
              lang === l.value
                ? 'bg-brand-50 border-brand-500 shadow-glow'
                : 'bg-white border-surface-200 hover:border-surface-300'
            }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
              lang === l.value ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-500'
            }`}>
              {l.label[0]}
            </div>
            <div className="text-left flex-1">
              <p className={`font-display font-bold text-lg ${lang === l.value ? 'text-brand-700' : 'text-surface-800'}`}>{l.label}</p>
              <p className="text-surface-400 text-xs">{l.desc}</p>
            </div>
            {lang === l.value && (
              <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button onClick={() => { if (!lang) return setErr('Pick a language'); go('auth'); }}
        className="w-full mt-6 btn-primary btn-lg flex items-center justify-center gap-2">
        Continue <ArrowRight size={18} />
      </button>
      <ErrorMsg />
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: AUTH
  // ═══════════════════════════════════════════════════════════════
  if (step === 'auth') return (
    <div className="min-h-screen bg-surface-50 flex flex-col px-5 pt-10 pb-8 max-w-md mx-auto">
      <StepBar />
      <BackBtn to={mode === 'login' ? 'welcome' : 'lang'} />

      <div className="mb-8">
        <h2 className="font-display font-extrabold text-2xl text-surface-900 tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-surface-400 text-sm mt-1.5">
          {mode === 'login' ? 'Log in to continue your learning streak' : 'Join thousands of learners across India'}
        </p>
      </div>

      {/* Google Sign-In */}
      <button onClick={handleGoogle} disabled={gLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-surface-200 rounded-xl py-3 mb-5 font-semibold text-surface-700 shadow-xs hover:shadow-subtle hover:border-surface-300 active:scale-[.98] transition-all text-sm disabled:opacity-50">
        {gLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-surface-300 border-t-surface-600 rounded-full animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-surface-200" />
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">or use email</span>
        <div className="flex-1 h-px bg-surface-200" />
      </div>

      <div className="space-y-3">
        {mode === 'register' && (
          <>
            <div>
              <label className="input-label">Full Name</label>
              <input className="input" placeholder="Your full name" value={name}
                onChange={e => { setName(e.target.value); setErr(''); }} />
            </div>
            <div>
              <label className="input-label">Village / City</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input className="input pl-10" placeholder="e.g. Wardha, Pune" value={village}
                  onChange={e => { setVillage(e.target.value); setErr(''); }} />
              </div>
            </div>
          </>
        )}
        <div>
          <label className="input-label">Email</label>
          <input className="input" type="email" placeholder="your@email.com" value={email}
            onChange={e => { setEmail(e.target.value); setErr(''); }} />
        </div>
        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <input className="input pr-12" type={showPw ? 'text' : 'password'}
              placeholder="Min 6 characters" value={pw}
              onChange={e => { setPw(e.target.value); setErr(''); }} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <ErrorMsg />

      <button onClick={handleAuth}
        className="w-full mt-5 btn-primary btn-lg flex items-center justify-center gap-2">
        {mode === 'login' ? 'Log In' : 'Continue'} <ArrowRight size={18} />
      </button>

      <p className="text-center text-sm text-surface-400 mt-5">
        {mode === 'login' ? "New here? " : "Already have an account? "}
        <button onClick={() => { setErr(''); setMode(mode === 'login' ? 'register' : 'login'); if (mode==='login') go('lang'); }}
          className="text-brand-600 font-semibold hover:underline underline-offset-2">
          {mode === 'login' ? 'Create account' : 'Log in'}
        </button>
      </p>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: CLASS
  // ═══════════════════════════════════════════════════════════════
  if (step === 'class') return (
    <div className="min-h-screen bg-surface-50 flex flex-col px-5 pt-10 pb-8 max-w-md mx-auto">
      <StepBar />
      <BackBtn to="auth" />

      <div className="mb-8">
        <h2 className="font-display font-extrabold text-2xl text-surface-900 tracking-tight">Select your class</h2>
        <p className="text-surface-400 text-sm mt-1.5">We'll personalize your learning experience</p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-6">
        {CLASSES.map(c => (
          <button key={c} onClick={() => { setCls(c); setErr(''); }}
            className={`h-14 rounded-xl font-display font-bold text-xl transition-all duration-200 active:scale-95 border ${
              cls === c
                ? 'bg-brand-600 text-white border-brand-600 shadow-glow'
                : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300 hover:bg-brand-50'
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['Free courses for all classes', 'Certificates on completion', 'Premium topics available'].map(t => (
          <span key={t} className="badge-brand text-[11px]">{t}</span>
        ))}
      </div>

      <ErrorMsg />

      <button onClick={() => { if (!cls) return setErr('Select your class'); go('goal'); }}
        className="w-full mt-auto btn-primary btn-lg flex items-center justify-center gap-2">
        Continue <ArrowRight size={18} />
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: GOAL
  // ═══════════════════════════════════════════════════════════════
  if (step === 'goal') return (
    <div className="min-h-screen bg-surface-50 flex flex-col px-5 pt-10 pb-8 max-w-md mx-auto">
      <StepBar />
      <BackBtn to="class" />

      <div className="mb-6">
        <h2 className="font-display font-extrabold text-2xl text-surface-900 tracking-tight">What's your goal?</h2>
        <p className="text-surface-400 text-sm mt-1.5">This helps us personalize your learning path</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {GOALS.map(g => (
          <button key={g.value} onClick={() => { setGoal(g.value); setErr(''); }}
            className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 active:scale-[.97] text-center ${
              goal === g.value
                ? 'bg-brand-50 border-brand-400 shadow-glow'
                : 'bg-white border-surface-200 hover:border-surface-300'
            }`}>
            <span className="text-2xl mb-2">{g.emoji}</span>
            <span className={`font-display font-bold text-sm leading-tight ${
              goal === g.value ? 'text-brand-700' : 'text-surface-700'
            }`}>{g.label}</span>
          </button>
        ))}
      </div>

      <ErrorMsg />

      <button onClick={() => { if (!goal) return setErr('Pick a goal'); handleFinish(); }}
        className="w-full mt-auto btn-accent btn-lg">
        🚀 Start Learning
      </button>

      {/* Summary */}
      <div className="mt-4 bg-surface-100 rounded-xl p-3 text-center">
        <p className="text-surface-500 text-xs font-medium">
          {LANGUAGES.find(l=>l.value===lang)?.label || lang} · Class {cls} · {GOALS.find(g=>g.value===goal)?.label || 'Goal'}
        </p>
      </div>
    </div>
  );

  return null;
}
