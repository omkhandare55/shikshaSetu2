// pages/voice.jsx — GraamVidya | Voice Learning System
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import {
  Mic, MicOff, Volume2, CheckCircle2, XCircle, RotateCcw,
  ChevronRight, Star, Zap, BookOpen, Trophy, Play, Square,
} from 'lucide-react';

const PRACTICE_SETS = [
  {
    id: 'greetings', label: 'Greetings', emoji: '👋', level: 'Easy',
    sentences: [
      { text: 'Good morning, how are you?',    hint: 'गुड मॉर्निंग, हाऊ आर यू?' },
      { text: 'My name is Rahul.',              hint: 'माय नेम इज राहुल.' },
      { text: 'Nice to meet you.',              hint: 'नाईस टू मीट यू.' },
      { text: 'Thank you very much.',           hint: 'थँक यू वेरी मच.' },
      { text: 'Please help me understand.',     hint: 'प्लीज हेल्प मी अंडरस्टँड.' },
    ],
  },
  {
    id: 'classroom', label: 'Classroom', emoji: '📚', level: 'Easy',
    sentences: [
      { text: 'Can you explain this again?',   hint: 'कॅन यू एक्सप्लेन दिस अगेन?' },
      { text: 'I do not understand.',          hint: 'आय डू नॉट अंडरस्टँड.' },
      { text: 'What is the answer?',           hint: 'व्हॉट इज द आन्सर?' },
      { text: 'I have a question.',            hint: 'आय हॅव अ क्वेश्चन.' },
      { text: 'May I go to the washroom?',     hint: 'मे आय गो टू द वॉशरूम?' },
    ],
  },
  {
    id: 'science', label: 'Science Words', emoji: '🔬', level: 'Medium',
    sentences: [
      { text: 'Photosynthesis produces oxygen.',     hint: 'फोटोसिंथेसिस प्रोड्यूसेस ऑक्सिजन.' },
      { text: 'The mitochondria is the powerhouse.', hint: 'द मायटोकॉन्ड्रिया इज द पावरहाऊस.' },
      { text: 'Gravity pulls objects downward.',     hint: 'ग्रॅव्हिटी पुल्स ऑब्जेक्ट्स डाऊनवर्ड.' },
      { text: 'Electrons carry negative charge.',   hint: 'इलेक्ट्रॉन्स कॅरी नेगेटिव्ह चार्ज.' },
    ],
  },
  {
    id: 'math', label: 'Math Language', emoji: '📐', level: 'Medium',
    sentences: [
      { text: 'The square root of sixteen is four.',     hint: 'द स्क्वेअर रूट ऑफ सिक्सटीन इज फोर.' },
      { text: 'Parallel lines never meet.',              hint: 'पॅरलल लाईन्स नेव्हर मीट.' },
      { text: 'The sum of angles in a triangle is one eighty degrees.', hint: 'द सम ऑफ एंगल्स इन अ ट्रायएंगल इज वन एटी डिग्रीज.' },
      { text: 'Divide both sides by two.',              hint: 'डिव्हाईड बोथ साईड्स बाय टू.' },
    ],
  },
  {
    id: 'interview', label: 'Interview Prep', emoji: '🎯', level: 'Hard',
    sentences: [
      { text: 'I am very passionate about learning.',      hint: 'आय ॲम वेरी पॅशनेट अबाऊट लर्निंग.' },
      { text: 'My greatest strength is perseverance.',     hint: 'माय ग्रेटेस्ट स्ट्रेंथ इज पर्सिव्हिअरन्स.' },
      { text: 'I believe in continuous improvement.',      hint: 'आय बिलीव्ह इन कंटिन्युअस इम्प्रूव्हमेंट.' },
      { text: 'I am confident and ready for new challenges.', hint: 'आय ॲम कॉन्फिडेंट अँड रेडी फॉर न्यू चॅलेंजेस.' },
    ],
  },
];

function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening]   = useState(false);
  const [supported, setSupported]   = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        setSupported(true);
        const rec = new SR();
        rec.lang = 'en-IN';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (e) => {
          const t = e.results[0][0].transcript;
          setTranscript(t);
          setListening(false);
        };
        rec.onerror = () => setListening(false);
        rec.onend   = () => setListening(false);
        recRef.current = rec;
      }
    }
  }, []);

  const start = () => {
    if (!recRef.current) return;
    setTranscript('');
    setListening(true);
    try { recRef.current.start(); } catch {}
  };
  const stop = () => {
    if (!recRef.current) return;
    setListening(false);
    try { recRef.current.stop(); } catch {}
  };

  return { transcript, listening, supported, start, stop, setTranscript };
}

function scorePronounciation(target, spoken) {
  if (!spoken) return 0;
  const t = target.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const s = spoken.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const tWords = t.split(/\s+/);
  const sWords = s.split(/\s+/);
  let matches = 0;
  tWords.forEach(w => { if (sWords.includes(w)) matches++; });
  return Math.round((matches / tWords.length) * 100);
}

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function VoicePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { transcript, listening, supported, start, stop, setTranscript } = useSpeechRecognition();

  const [activeSet, setActiveSet]     = useState(null);
  const [sentIdx, setSentIdx]         = useState(0);
  const [score, setScore]             = useState(null);
  const [sessionXP, setSessionXP]     = useState(0);
  const [history, setHistory]         = useState([]);
  const [showHint, setShowHint]       = useState(false);

  useEffect(() => { if (!loading && !user) router.replace('/'); }, [user, loading]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const sentence = activeSet ? activeSet.sentences[sentIdx] : null;

  const handleCheck = () => {
    if (!transcript) return;
    const s = scorePronounciation(sentence.text, transcript);
    setScore(s);
    setHistory(h => [...h, { text: sentence.text, spoken: transcript, score: s }]);
    if (s >= 60) {
      setSessionXP(x => x + (s >= 80 ? 15 : 10));
    }
  };

  const handleNext = () => {
    if (!activeSet) return;
    if (sentIdx + 1 >= activeSet.sentences.length) {
      setActiveSet(null);
      setSentIdx(0);
    } else {
      setSentIdx(i => i + 1);
    }
    setScore(null);
    setTranscript('');
    setShowHint(false);
  };

  const handleRetry = () => {
    setScore(null);
    setTranscript('');
    setShowHint(false);
  };

  const scoreColor = score == null ? '' : score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg    = score == null ? '' : score >= 80 ? 'bg-emerald-50 border-emerald-300' : score >= 60 ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300';

  // ── SET PICKER ─────────────────────────────────────────────────────────────
  if (!activeSet) return (
    <AppShell title="🎤 Voice Practice" back onBack={() => router.push('/home')}>
      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Hero */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-teal-500 to-emerald-600 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Mic size={32} className="text-white" />
            </div>
            <div>
              <p className="text-white font-display font-900 text-xl">Voice Practice</p>
              <p className="text-white/70 text-sm mt-0.5">Speak → AI checks → Improve English</p>
              {sessionXP > 0 && (
                <p className="text-emerald-200 text-xs mt-1 font-700">+{sessionXP} XP this session 🔥</p>
              )}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: '🎤', label: 'Speak', desc: 'Read the sentence aloud' },
            { emoji: '🤖', label: 'AI Checks', desc: 'Speech recognition scores you' },
            { emoji: '📈', label: 'Improve', desc: 'Earn XP, build confidence' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
              <div className="text-2xl mb-1">{c.emoji}</div>
              <p className="font-700 text-slate-700 text-xs">{c.label}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{c.desc}</p>
            </div>
          ))}
        </div>

        {!supported && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-700 text-amber-700 text-sm">⚠️ Microphone not supported</p>
            <p className="text-amber-600 text-xs mt-1">Use Chrome browser on Android for best experience. You can still read and listen to the sentences.</p>
          </div>
        )}

        {/* Session XP */}
        {history.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="font-display font-800 text-emerald-700 text-sm mb-2">📊 Session Stats</p>
            <div className="flex gap-4">
              <div><p className="font-900 text-emerald-600 text-xl">{history.length}</p><p className="text-xs text-slate-400">Practiced</p></div>
              <div><p className="font-900 text-amber-500 text-xl">+{sessionXP}</p><p className="text-xs text-slate-400">XP Earned</p></div>
              <div>
                <p className="font-900 text-brand-600 text-xl">
                  {history.length > 0 ? Math.round(history.reduce((a, h) => a + h.score, 0) / history.length) : 0}%
                </p>
                <p className="text-xs text-slate-400">Avg Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Practice Sets */}
        <div>
          <p className="font-display font-800 text-slate-700 text-sm mb-3">Choose a Practice Set</p>
          <div className="space-y-3">
            {PRACTICE_SETS.map((set, i) => (
              <button key={set.id} onClick={() => { setActiveSet(set); setSentIdx(0); setScore(null); setTranscript(''); }}
                className="w-full text-left animate-pop" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[.97] transition-all hover:border-teal-300">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">{set.emoji}</div>
                  <div className="flex-1">
                    <p className="font-display font-800 text-slate-800">{set.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{set.sentences.length} sentences · {set.level}</p>
                  </div>
                  <span className={`text-[10px] font-800 px-2 py-1 rounded-full ${
                    set.level === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                    set.level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>{set.level}</span>
                  <ChevronRight size={16} className="text-slate-300 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );

  // ── PRACTICE SCREEN ─────────────────────────────────────────────────────────
  return (
    <AppShell title={`${activeSet.emoji} ${activeSet.label}`} back onBack={() => { setActiveSet(null); setSentIdx(0); setScore(null); setTranscript(''); }}>
      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-700 text-slate-500">{sentIdx + 1} / {activeSet.sentences.length}</p>
          <span className="text-xs font-700 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">+{sessionXP} XP</span>
        </div>
        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${((sentIdx + 1) / activeSet.sentences.length) * 100}%` }} />
        </div>

        {/* Sentence card */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-6">
          <p className="text-teal-600 text-xs font-700 uppercase tracking-wider mb-3">Read this aloud:</p>
          <p className="font-display font-900 text-slate-800 text-xl leading-snug mb-4">
            "{sentence.text}"
          </p>
          <div className="flex gap-3">
            <button onClick={() => speak(sentence.text)}
              className="flex items-center gap-2 bg-teal-500 text-white text-sm font-700 px-4 py-2.5 rounded-xl active:scale-95 transition-all">
              <Volume2 size={16} /> Listen
            </button>
            <button onClick={() => setShowHint(h => !h)}
              className="flex items-center gap-2 bg-white text-slate-600 text-sm font-700 px-4 py-2.5 rounded-xl border border-slate-200 active:scale-95 transition-all">
              💡 Hint
            </button>
          </div>
          {showHint && (
            <div className="mt-3 bg-white/80 rounded-xl p-3 border border-teal-100">
              <p className="text-teal-700 text-sm font-600 leading-relaxed">{sentence.hint}</p>
            </div>
          )}
        </div>

        {/* Mic button */}
        <div className="flex flex-col items-center gap-4">
          {!listening ? (
            <button onClick={start}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                transcript ? 'bg-emerald-500' : 'bg-gradient-to-br from-teal-500 to-emerald-600'
              }`}>
              <Mic size={36} className="text-white" />
            </button>
          ) : (
            <button onClick={stop}
              className="w-24 h-24 rounded-full bg-rose-500 flex items-center justify-center shadow-xl animate-pulse active:scale-95 transition-all">
              <Square size={32} className="text-white fill-white" />
            </button>
          )}
          <p className="text-sm font-600 text-slate-500">
            {listening ? '🎙️ Listening… speak now!' : transcript ? '✅ Got it! Check your score.' : 'Tap mic and speak'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 animate-fade-up">
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wider mb-1">You said:</p>
            <p className="font-display font-700 text-slate-700 text-base">"{transcript}"</p>
          </div>
        )}

        {/* Score result */}
        {score !== null && (
          <div className={`rounded-2xl p-5 border-2 animate-fade-up ${scoreBg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`font-display font-900 text-3xl ${scoreColor}`}>{score}%</p>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                {score >= 60 ? <CheckCircle2 size={24} className="text-white" /> : <XCircle size={24} className="text-white" />}
              </div>
            </div>
            <p className={`font-700 text-sm mb-1 ${scoreColor}`}>
              {score >= 80 ? '🌟 Excellent pronunciation!' : score >= 60 ? '👍 Good! Keep practicing.' : '📚 Try again — speak more clearly.'}
            </p>
            {score >= 60 && (
              <p className="text-xs text-emerald-600 font-700">+{score >= 80 ? 15 : 10} XP earned!</p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {score === null && transcript && (
            <button onClick={handleCheck}
              className="w-full bg-teal-600 text-white font-display font-800 py-4 rounded-2xl shadow-lg active:scale-[.97] transition-all">
              ✅ Check My Pronunciation
            </button>
          )}
          {score !== null && (
            <>
              <button onClick={handleNext}
                className="w-full bg-brand-700 text-white font-display font-800 py-4 rounded-2xl shadow-glow active:scale-[.97] transition-all flex items-center justify-center gap-2">
                {sentIdx + 1 >= activeSet.sentences.length ? '🏁 Finish Practice' : 'Next Sentence'}
                <ChevronRight size={18} />
              </button>
              <button onClick={handleRetry}
                className="w-full bg-white text-slate-600 font-700 py-3 rounded-2xl border border-slate-200 active:scale-[.97] transition-all flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Try Again
              </button>
            </>
          )}
        </div>

      </div>
    </AppShell>
  );
}
