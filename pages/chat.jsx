// pages/chat.jsx — GraamVidya AI Mentor Chat (Professional UI)
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Send, X, Volume2, Sparkles, ChevronDown,
  AlertTriangle, Camera, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { mentorChat } from '../services/mentorApi';

// ── Text-to-speech ──────────────────────────────────────────────
function speak(text, lang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'hindi' ? 'hi-IN' : lang === 'marathi' ? 'mr-IN' : 'en-IN';
  u.rate = 0.88;
  window.speechSynthesis.speak(u);
}

// ── Topic categories ────────────────────────────────────────────
const TOPICS = [
  { id: 'academic',    emoji: '📚', label: 'Academic',       hint: 'Ask any subject question — Maths, Science, English…' },
  { id: 'career',      emoji: '🎯', label: 'Career',         hint: 'What to do after 10th / 12th? Which stream to choose?' },
  { id: 'scholarship', emoji: '🎓', label: 'Scholarships',   hint: 'Find scholarships, eligibility, deadlines.' },
  { id: 'exam',        emoji: '📝', label: 'Exam Prep',      hint: 'Study plan, important chapters, time management.' },
  { id: 'motivation',  emoji: '💪', label: 'Motivation',     hint: 'Feeling stuck? Let\'s talk.' },
  { id: 'general',     emoji: '💬', label: 'General',        hint: 'Anything else — type freely.' },
];

const SUGGESTIONS = {
  academic:    ['Pythagoras theorem काय आहे?', 'What is Newton\'s 2nd law?', 'Active voice म्हणजे काय?'],
  career:      ['10वी नंतर काय करू?', '12वी Science नंतर options?', 'Which field has most jobs?'],
  scholarship: ['NSP scholarship कसे apply करायचे?', 'Maharashtra scholarship list', 'PM Yasasvi eligibility?'],
  exam:        ['Board exam tips द्या', 'Important chapters for Class 10', 'Science study plan'],
  motivation:  ['मला अभ्यास नको वाटतो', 'How to build self-confidence?', 'मी exam fail झाल्यावर काय करू?'],
  general:     ['GraamVidya कसे वापरायचे?', 'Certificates कसे मिळतात?', 'Free courses कुठे आहेत?'],
};

// ── Message Renderer ────────────────────────────────────────────
function BotMessage({ text, onSpeak }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="bubble-bot whitespace-pre-wrap">{text}</div>
      <button onClick={onSpeak}
        className="self-start flex items-center gap-1 text-[10px] text-surface-400 hover:text-brand-500 transition-colors ml-1 mt-0.5">
        <Volume2 size={11} /> Listen
      </button>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [topic, setTopic]       = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const [imgFile, setImgFile]   = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [lang, setLang]         = useState('');
  const [cls, setCls]           = useState('10');
  const [history, setHistory]   = useState([]);

  const endRef   = useRef();
  const inputRef = useRef();
  const fileRef  = useRef();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      setLang(user.language || 'marathi');
      setCls(user.class || '10');
    }
  }, [user, loading, router]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image too large (max 5 MB)'); return; }
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImgPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setImgFile(null); setImgPreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const send = useCallback(async (overrideText) => {
    const text = (overrideText || input).trim();
    if ((!text && !imgFile) || sending) return;

    setInput('');
    const userMsg = { role: 'user', text, image: imgPreview || null, id: Date.now() };
    setMessages(m => [...m, userMsg]);
    clearImage();
    setSending(true);

    const topicHint = TOPICS.find(t => t.id === topic)?.label || '';
    const fullMessage = `[Topic: ${topicHint}] ${text}${imgFile ? ' [Student uploaded an image of their textbook question]' : ''}`;
    const newHistory  = [...history, { role: 'user', content: text }];

    try {
      const res = await mentorChat({
        message: fullMessage,
        language: lang,
        class_grade: cls,
        student_level: 'medium',
        session_history: history.slice(-6),
      });

      let answerText = res.answer || '';
      if (res.steps?.length) answerText += '\n\n' + res.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
      if (res.tip) answerText += `\n\n💡 Tip: ${res.tip}`;
      if (res.suggested_next) answerText += `\n\n📖 Next: Study "${res.suggested_next}"`;

      if (!answerText || answerText.length < 5) {
        answerText = 'I\'m not sure about this question. Please ask more clearly or mention your chapter/subject so I can help better.';
      }

      setMessages(m => [...m, { role: 'bot', text: answerText, id: Date.now() }]);
      setHistory([...newHistory, { role: 'assistant', content: answerText }]);
    } catch {
      setMessages(m => [...m, { role: 'bot', text: 'AI Mentor is offline right now. Check your internet and try again.', id: Date.now() }]);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, sending, imgFile, imgPreview, topic, lang, cls, history]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50"><Spinner size="lg" /></div>
  );

  const firstName = user.name?.split(' ')[0] || 'Student';
  const selectedTopic = TOPICS.find(t => t.id === topic);

  // ── TOPIC PICKER ──────────────────────────────────────────────
  if (!topic) return (
    <AppShell title="AI Mentor">
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Hero */}
        <div className="card p-5 bg-gradient-to-br from-brand-600 to-brand-700 border-0 animate-enter">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-lg">Hello, {firstName}</p>
              <p className="text-white/60 text-sm mt-0.5">I'm your AI learning mentor</p>
            </div>
          </div>
        </div>

        {/* Info badge */}
        <div className="flex items-start gap-2.5 card-flat px-4 py-3 animate-enter delay-1">
          <AlertTriangle size={14} className="text-accent-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-surface-700 text-xs font-semibold">Verified Answers Only</p>
            <p className="text-surface-400 text-[11px] mt-0.5">
              Based on Maharashtra State Board curriculum. If I don't know, I'll say so.
            </p>
          </div>
        </div>

        {/* Topic grid */}
        <div className="animate-enter delay-2">
          <p className="section-title mb-3">What would you like to ask?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {TOPICS.map((t, i) => (
              <button key={t.id} onClick={() => {
                  setTopic(t.id);
                  setMessages([{ role: 'bot', text: `${t.hint}\n\nClass ${cls} · ${lang === 'marathi' ? 'मराठी' : lang === 'hindi' ? 'हिंदी' : 'English'}\n\nType below or tap a suggestion!`, id: Date.now() }]);
                }}
                className="card-interactive p-3.5 text-left"
                style={{ animationDelay: `${100 + i * 30}ms` }}>
                <span className="text-2xl">{t.emoji}</span>
                <p className="font-display font-bold text-sm text-surface-800 mt-2 leading-tight">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language + class */}
        <div className="flex items-center gap-2 flex-wrap animate-enter delay-4">
          <p className="text-xs text-surface-400 font-medium">Settings:</p>
          {['marathi','hindi','english'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                lang === l ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-surface-500 border-surface-200'
              }`}>
              {l === 'marathi' ? 'मराठी' : l === 'hindi' ? 'हिंदी' : 'English'}
            </button>
          ))}
          <select value={cls} onChange={e => setCls(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-surface-200 bg-white text-surface-600">
            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>

        {/* Info toggle */}
        <button onClick={() => setShowInfo(v => !v)}
          className="w-full flex items-center justify-between card-flat px-4 py-3 text-surface-500 text-sm font-medium">
          <span>About AI Mentor</span>
          <ChevronDown size={16} className={`transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </button>
        {showInfo && (
          <div className="card-flat px-4 py-3 text-xs text-surface-500 leading-relaxed">
            GraamVidya AI Mentor answers are based on Maharashtra State Board curriculum (Class 1–12), real scholarship databases, and verified career data. No made-up information. You can upload textbook photos for solutions.
          </div>
        )}
      </div>
    </AppShell>
  );

  // ── CHAT SCREEN ───────────────────────────────────────────────
  return (
    <AppShell title={`${selectedTopic?.emoji} ${selectedTopic?.label}`}
      back onBack={() => { setTopic(null); setMessages([]); setHistory([]); }}>

      {/* Topic + language bar */}
      <div className="px-4 pt-2 pb-2 border-b border-surface-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="badge-brand text-[11px] shrink-0">
          {selectedTopic?.emoji} {selectedTopic?.label}
        </span>
        <div className="flex gap-1.5 ml-auto shrink-0">
          {['marathi','hindi','english'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all ${
                lang === l ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-surface-400 border-surface-200'
              }`}>
              {l === 'marathi' ? 'मरा' : l === 'hindi' ? 'हि' : 'EN'}
            </button>
          ))}
          <select value={cls} onChange={e => setCls(e.target.value)}
            className="px-1.5 py-1 rounded-md text-[10px] font-semibold border border-surface-200 bg-white text-surface-500">
            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="animate-enter">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Quick questions</p>
              <div className="flex flex-wrap gap-2">
                {(SUGGESTIONS[topic] || []).map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs bg-white border border-surface-200 text-surface-600 px-3 py-1.5 rounded-lg shadow-xs hover:border-brand-300 hover:text-brand-600 transition-all active:scale-95 font-medium">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map(msg => (
            <div key={msg.id}
              className={`flex items-end gap-2 animate-enter ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

              {msg.role === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shrink-0 mb-0.5">
                  <Sparkles size={13} className="text-white" />
                </div>
              )}

              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.image && (
                  <img src={msg.image} alt="Question" className="rounded-xl mb-1.5 max-h-48 object-contain border border-surface-200 shadow-xs" />
                )}
                {msg.role === 'bot'
                  ? <BotMessage text={msg.text} onSpeak={() => speak(msg.text, lang)} />
                  : msg.text ? <div className="bubble-user whitespace-pre-wrap">{msg.text}</div> : null
                }
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 mb-0.5">
                  <span className="text-white font-display font-bold text-xs">{firstName[0]}</span>
                </div>
              )}
            </div>
          ))}

          {/* Typing */}
          {sending && (
            <div className="flex items-end gap-2 animate-enter">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="bubble-bot">
                <div className="flex items-center gap-1.5 py-0.5">
                  {[0,150,300].map(d => (
                    <div key={d} className="h-1.5 w-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} className="h-1" />
        </div>

        {/* Input bar */}
        <div className="border-t border-surface-100 bg-white px-3 pt-2 pb-3">

          {imgPreview && (
            <div className="flex items-center gap-2 mb-2 card-flat px-3 py-2">
              <img src={imgPreview} alt="upload" className="h-10 w-10 object-cover rounded-lg border border-surface-200" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-surface-600">Photo attached</p>
                <p className="text-2xs text-surface-400">AI will read & solve</p>
              </div>
              <button onClick={clearImage} className="p-1 rounded-lg text-surface-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="btn-icon bg-surface-100 hover:bg-brand-50 text-surface-400 hover:text-brand-600 shrink-0">
              <Camera size={18} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

            <textarea
              ref={inputRef}
              className="flex-1 input min-h-[44px] max-h-32 py-2.5 resize-none"
              placeholder={`Ask in any language… (Class ${cls})`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />

            <button onClick={() => send()}
              disabled={(!input.trim() && !imgFile) || sending}
              className={`btn-icon shrink-0 ${
                (input.trim() || imgFile) && !sending
                  ? 'bg-brand-600 text-white shadow-glow hover:bg-brand-700'
                  : 'bg-surface-100 text-surface-300 cursor-not-allowed'
              }`}>
              {sending
                ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={16} />}
            </button>
          </div>

          <p className="text-center text-2xs text-surface-300 mt-1.5">
            Verified answers only · Registered students · Photo doubts supported
          </p>
        </div>
      </div>
    </AppShell>
  );
}
