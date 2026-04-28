// pages/revision.jsx — Full Smart Revision + Question Prediction (i18n)
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft, BookOpen, Brain, CheckCircle2, ChevronRight, FileText,
  Sparkles, Star, Target, Zap, TrendingUp, AlertTriangle, Clock,
  Download, RefreshCw, Filter,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import Spinner from '../components/ui/Spinner';

const SUBJECTS = [
  { id: 'math', nameKey: 'rev_math', icon: Brain, gradient: 'from-brand-400 to-brand-600', badge: 'bg-brand-100 text-brand-700' },
  { id: 'science', nameKey: 'rev_science', icon: Zap, gradient: 'from-indigo-400 to-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
  { id: 'english', nameKey: 'rev_english', icon: BookOpen, gradient: 'from-emerald-400 to-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
];

const REVISION_DATA = {
  math: {
    chapters: [
      {
        name: 'Algebra',
        notes: [
          { text: 'Quadratic equations have at most **two roots**. Use the formula: x = (-b ± √(b²-4ac)) / 2a', important: true },
          { text: 'For a linear equation ax + b = 0, the solution is x = -b/a', important: false },
          { text: 'The **discriminant** (b²-4ac) tells you the nature of roots: >0 means two real roots, =0 means equal roots, <0 means no real roots', important: true },
        ],
        questions: [
          { q: 'Find the roots of x² - 5x + 6 = 0.', probability: 92, marks: 3, type: 'Problem' },
          { q: 'For what value of k does kx² + 4x + 1 = 0 have equal roots?', probability: 85, marks: 4, type: 'Application' },
        ],
      },
      {
        name: 'Geometry',
        notes: [
          { text: 'In a right triangle, **a² + b² = c²** (Pythagoras theorem)', important: true },
          { text: 'Area of triangle = ½ × base × height', important: false },
          { text: 'Similar triangles have the **same angles** and proportional sides', important: true },
        ],
        questions: [
          { q: 'State and prove the Pythagoras theorem.', probability: 95, marks: 5, type: 'Theory' },
          { q: 'Two triangles are similar. If sides are 3,4,5 and 6,8,x, find x.', probability: 78, marks: 3, type: 'Problem' },
        ],
      },
    ],
    flashCards: [
      { front: 'What is the value of π?', back: '3.14159... (approximately 22/7)' },
      { front: 'Sum of angles in a triangle?', back: '180°' },
      { front: 'Area of a circle?', back: 'π × r²' },
      { front: 'Volume of a cube?', back: 'side³ (s³)' },
    ],
    examTip: 'Always show your working. In geometry, draw a clear diagram first!',
  },
  science: {
    chapters: [
      {
        name: 'Biology',
        notes: [
          { text: '**Photosynthesis**: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂', important: true },
          { text: 'Chlorophyll is found in the chloroplast and is responsible for capturing light energy', important: false },
          { text: 'Osmosis is the movement of water from a region of **high concentration to low** concentration through a semi-permeable membrane', important: true },
        ],
        questions: [
          { q: 'What are the raw materials and products of photosynthesis?', probability: 90, marks: 4, type: 'Theory' },
          { q: 'Explain the process of osmosis with a diagram.', probability: 82, marks: 5, type: 'Application' },
        ],
      },
      {
        name: 'Physics',
        notes: [
          { text: "**Ohm's Law**: Voltage (V) = Current (I) × Resistance (R)", important: true },
          { text: 'Power (P) = V × I = I²R = V²/R', important: true },
          { text: 'Resistors in series: R_total = R₁ + R₂ + R₃', important: false },
        ],
        questions: [
          { q: "State Ohm's Law and derive its formula. Draw a V-I graph.", probability: 88, marks: 5, type: 'Theory' },
          { q: 'Calculate equivalent resistance for 3Ω and 6Ω in parallel.', probability: 75, marks: 3, type: 'Problem' },
        ],
      },
    ],
    flashCards: [
      { front: 'Unit of electric current?', back: 'Ampere (A)' },
      { front: 'SI unit of resistance?', back: 'Ohm (Ω)' },
      { front: 'Which gas is released in photosynthesis?', back: 'Oxygen (O₂)' },
      { front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
    ],
    examTip: 'For Physics numericals, always write the formula before substituting values. Label all diagrams!',
  },
  english: {
    chapters: [
      {
        name: 'Grammar',
        notes: [
          { text: 'A **clause** must have a subject and a verb. Independent clauses can stand alone.', important: true },
          { text: 'Active voice: Subject does the action. Passive voice: Subject receives the action.', important: false },
          { text: '**Reported speech**: Change pronouns, tense, and time expressions when converting direct to indirect speech.', important: true },
        ],
        questions: [
          { q: 'Convert into passive voice: "The teacher solved the problem."', probability: 88, marks: 2, type: 'Application' },
          { q: 'Identify the subordinating conjunction and explain its use.', probability: 72, marks: 3, type: 'Theory' },
        ],
      },
      {
        name: 'Writing',
        notes: [
          { text: 'Formal letters follow: Address → Date → Subject → Salutation → Body → Closing', important: true },
          { text: 'A paragraph should have: **Topic sentence** → Supporting details → Concluding sentence', important: true },
          { text: 'Metaphors compare without "like" or "as". Similes use "like" or "as".', important: false },
        ],
        questions: [
          { q: 'Write a formal letter to the Principal requesting 2 days leave.', probability: 91, marks: 5, type: 'Writing' },
          { q: 'Write a paragraph on "The Importance of Trees" in 100 words.', probability: 84, marks: 4, type: 'Writing' },
        ],
      },
    ],
    flashCards: [
      { front: 'Synonym of "Enormous"?', back: 'Huge, Gigantic, Colossal' },
      { front: 'Antonym of "Transparent"?', back: 'Opaque' },
      { front: 'What is an idiom?', back: 'A phrase with a meaning different from the literal meaning' },
      { front: 'Parts of speech?', back: 'Noun, Pronoun, Verb, Adverb, Adjective, Preposition, Conjunction, Interjection' },
    ],
    examTip: 'In writing questions, plan your answer first (2 min), then write. Use paragraphs!',
  },
};

function BoldText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-800 text-slate-900">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

function FlashCard({ card, t }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button onClick={() => setFlipped(f => !f)} className="w-full text-left">
      <div className={`rounded-2xl p-5 min-h-[100px] flex flex-col justify-between transition-all duration-300 ${flipped ? 'bg-brand-500' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <span className={`text-[10px] font-800 uppercase tracking-wider ${flipped ? 'text-brand-200' : 'text-slate-400'}`}>
          {flipped ? t('rev_ans') : t('rev_tap')}
        </span>
        <p className={`font-display font-800 text-lg mt-2 ${flipped ? 'text-white' : 'text-slate-800'}`}>
          {flipped ? card.back : card.front}
        </p>
        <span className={`text-[10px] font-600 ${flipped ? 'text-brand-200' : 'text-slate-400'}`}>
          {flipped ? t('rev_flip') : t('rev_card')}
        </span>
      </div>
    </button>
  );
}

export default function RevisionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'questions' | 'flashcards'
  const [loading, setLoading] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);

  const data = selectedSubject ? REVISION_DATA[selectedSubject] : null;
  const subjectInfo = selectedSubject ? SUBJECTS.find(s => s.id === selectedSubject) : null;

  const allQuestions = data
    ? data.chapters.flatMap(ch => ch.questions.map(q => ({ ...q, chapter: ch.name })))
        .sort((a, b) => b.probability - a.probability)
    : [];

  const handleSubjectClick = (subjId) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedSubject(subjId);
      setActiveTab('notes');
      setFlashIdx(0);
      setLoading(false);
    }, 1000);
  };

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-28 space-y-5">
        <div className="flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedSubject ? setSelectedSubject(null) : router.back()}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <h2 className="font-display font-900 text-2xl text-slate-900 leading-tight">{t('rev_title')}</h2>
              <p className="text-sm font-500 text-slate-500">
                {selectedSubject ? t(subjectInfo.nameKey) : t('rev_sub')}
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-blue-500" />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
            <Spinner size="lg" />
            <p className="mt-6 font-display font-700 text-slate-700 text-lg">{t('rev_prep')}</p>
            <p className="text-sm text-slate-500 mt-1">{t('rev_analyzing')}</p>
          </div>
        )}

        {!selectedSubject && !loading && (
          <div className="space-y-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-200" />
                <p className="text-blue-200 text-sm font-700">AI-Powered Revision</p>
              </div>
              <h3 className="text-white font-display font-900 text-2xl mb-2">{t('rev_hero')}</h3>
              <p className="text-blue-100 text-sm">{t('rev_heroDesc')}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {[t('rev_tabNotes'), t('rev_tabPred'), t('rev_tabFlash')].map(tag => (
                  <span key={tag} className="bg-white/20 text-white text-[11px] font-700 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <h3 className="font-display font-800 text-slate-700 text-base">{t('rev_choose')}</h3>
            <div className="space-y-3">
              {SUBJECTS.map(subj => {
                const Icon = subj.icon;
                return (
                  <button key={subj.id} onClick={() => handleSubjectClick(subj.id)} className="w-full text-left">
                    <div className="card p-4 flex items-center justify-between active:scale-[.98] transition-transform hover:shadow-md hover:-translate-y-0.5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${subj.gradient}`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="font-display font-800 text-lg text-slate-800">{t(subj.nameKey)}</p>
                          <p className="text-xs text-slate-500 font-500">
                            {t('rev_subjStats', { c: REVISION_DATA[subj.id].chapters.length, q: REVISION_DATA[subj.id].chapters.reduce((a, c) => a + c.questions.length, 0), f: REVISION_DATA[subj.id].flashCards.length })}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <p className="font-display font-800 text-amber-800 text-sm">{t('rev_genTip')}</p>
              </div>
              <p className="text-xs text-amber-700 font-600 leading-relaxed">{t('rev_genTipDesc')}</p>
            </div>
          </div>
        )}

        {selectedSubject && !loading && (
          <div className="space-y-5 animate-fade-up">
            <div className={`p-5 rounded-2xl bg-gradient-to-br ${subjectInfo.gradient}`}>
              <p className="text-white/70 text-sm font-600 mb-1">Crash Revision</p>
              <h2 className="text-white font-display font-900 text-2xl">{t(subjectInfo.nameKey)}</h2>
              <div className="mt-3 flex gap-2 flex-wrap">
                {[t('rev_tabNotes'), t('rev_tabPred'), t('rev_tabFlash')].map((tab) => (
                  <span key={tab} className="bg-white/20 px-3 py-1 rounded-lg text-xs font-700 text-white">{tab}</span>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-600 leading-relaxed">
                <span className="font-800">Exam Tip:</span> {data.examTip}
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {[
                { id: 'notes', label: t('rev_tabNotes') },
                { id: 'questions', label: t('rev_tabPred') },
                { id: 'flashcards', label: t('rev_tabFlash') },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-800 transition-all ${
                    activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'notes' && (
              <div className="space-y-6">
                {data.chapters.map(chapter => (
                  <div key={chapter.name} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FileText size={15} className="text-amber-600" />
                      </div>
                      <h3 className="font-display font-800 text-slate-800 text-base">{chapter.name}</h3>
                    </div>
                    <div className="space-y-2.5">
                      {chapter.notes.map((note, i) => (
                        <div key={i} className={`card p-4 flex items-start gap-3 border-l-4 ${note.important ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200'}`}>
                          <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${note.important ? 'text-amber-500' : 'text-slate-300'}`} />
                          <div>
                            {note.important && (
                              <span className="text-[10px] font-800 text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                                ⭐ {t('rev_highPrio')}
                              </span>
                            )}
                            <p className="text-sm font-600 text-slate-700 leading-relaxed">
                              <BoldText text={note.text} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
                  <Target size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 font-600 leading-relaxed">{t('rev_predAlert')}</p>
                </div>

                {allQuestions.map((q, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-sm font-700 text-slate-800 leading-relaxed flex-1">{q.q}</p>
                      <div className="text-right shrink-0">
                        <div className={`inline-flex items-center gap-1 text-[11px] font-800 px-2 py-1 rounded-lg ${
                          q.probability >= 85 ? 'bg-rose-100 text-rose-600' : q.probability >= 75 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Star size={10} className={q.probability >= 85 ? 'fill-rose-600' : q.probability >= 75 ? 'fill-amber-600' : ''} />
                          {q.probability}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${subjectInfo.badge}`}>{q.chapter}</span>
                      <span className="text-[10px] font-700 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{q.type}</span>
                      <span className="text-[10px] font-700 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t('rev_marks', { m: q.marks })}</span>
                    </div>
                    <div className="mt-3">
                      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${q.probability >= 85 ? 'bg-rose-400' : q.probability >= 75 ? 'bg-amber-400' : 'bg-slate-300'}`} style={{ width: `${q.probability}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-600 mt-0.5">{t('rev_prob')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 font-600 text-center">{t('rev_tapRev')}</p>
                <div className="grid grid-cols-1 gap-3">
                  {data.flashCards.map((card, i) => (
                    <FlashCard key={i} card={card} t={t} />
                  ))}
                </div>
                <button
                  onClick={() => setFlashIdx(i => (i + 1) % data.flashCards.length)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-700 text-sm hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  <RefreshCw size={16} /> {t('rev_shuf')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
