// pages/syllabus.jsx — Class-aware Syllabus Browser
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { ChevronRight, BookOpen, CheckCircle2, Lock, Star } from 'lucide-react';

// Full Class 1-12 syllabus data (offline, no API needed)
const SYLLABUS = {
  Mathematics: {
    icon: '📐', color: 'from-brand-500 to-brand-700', light: 'bg-brand-50 border-brand-200', text: 'text-brand-700',
    classes: {
      '1': ['Counting 1-100', 'Basic Addition', 'Basic Subtraction', 'Shapes Around Us'],
      '2': ['Numbers up to 1000', 'Addition with Carry', 'Subtraction with Borrow', 'Multiplication Tables 1-5', 'Simple Fractions'],
      '3': ['Numbers up to 10,000', 'Multiplication Tables 1-10', 'Division Basics', 'Fractions', 'Measurement'],
      '4': ['Large Numbers', 'Factors & Multiples', 'Fractions & Decimals', 'Geometry Basics', 'Time & Money'],
      '5': ['HCF & LCM', 'Fractions', 'Decimals', 'Percentages', 'Area & Perimeter', 'Data Handling'],
      '6': ['Natural Numbers & Integers', 'Fractions & Decimals', 'Basic Algebra', 'Ratio & Proportion', 'Geometry'],
      '7': ['Integers', 'Fractions & Rational Numbers', 'Simple Equations', 'Lines & Angles', 'Triangles', 'Data Handling'],
      '8': ['Rational Numbers', 'Linear Equations', 'Quadrilaterals', 'Squares & Square Roots', 'Mensuration', 'Graphs'],
      '9': ['Number Systems', 'Polynomials', 'Linear Equations', 'Coordinate Geometry', 'Triangles', 'Statistics', 'Probability'],
      '10': ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Trigonometry', 'Statistics'],
      '11': ['Sets & Functions', 'Trigonometry', 'Complex Numbers', 'Sequences & Series', 'Straight Lines', 'Permutations', 'Statistics'],
      '12': ['Relations & Functions', 'Matrices', 'Determinants', 'Differentiation', 'Integration', 'Differential Equations', 'Vectors', 'Probability'],
    },
  },
  Science: {
    icon: '🔬', color: 'from-indigo-500 to-indigo-700', light: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700',
    classes: {
      '1': ['Living & Non-Living Things', 'My Body', 'Plants Around Us', 'Animals Around Us', 'Food We Eat'],
      '2': ['Plants & Their Parts', 'Animals & Their Homes', 'Air & Water', 'Our Senses', 'Seasons'],
      '3': ['Plants: Growth & Needs', 'Animal Life', 'Water Cycle', 'Soil & Rocks', 'Light & Shadows'],
      '4': ['Food & Digestion', 'Teeth & Microbes', 'Fuels & Energy', 'Magnetism', 'States of Matter'],
      '5': ['Crops & Agriculture', 'Human Body Systems', 'Matter Around Us', 'Force & Motion', 'Electric Circuits'],
      '6': ['Food: Where It Comes From', 'Living Organisms', 'Separation of Substances', 'Light & Shadows', 'Electricity & Circuits'],
      '7': ['Nutrition in Plants', 'Nutrition in Animals', 'Heat', 'Acids, Bases & Salts', 'Weather & Climate', 'Transportation in Plants'],
      '8': ['Crop Production', 'Cell Structure', 'Synthetic Fibres', 'Combustion', 'Light', 'Stars & Solar System'],
      '9': ['Matter & Its States', 'Atoms & Molecules', 'Cell Biology', 'Tissues', 'Forces & Motion', 'Gravitation', 'Work & Energy', 'Sound'],
      '10': ['Chemical Reactions', 'Acids, Bases & Salts', 'Metals & Non-Metals', 'Life Processes', 'Heredity & Evolution', 'Light', 'Electricity', 'Magnetic Effects'],
      '11': ['Physical World', 'Units & Measurement', 'Laws of Motion', 'Work & Energy', 'Thermodynamics', 'Cell Biology', 'Biomolecules', 'Digestion'],
      '12': ['Electric Charges', 'Magnetism', 'Electromagnetic Waves', 'Dual Nature of Radiation', 'Semiconductor Devices', 'Reproduction in Organisms', 'Genetics', 'Ecology'],
    },
  },
  English: {
    icon: '📚', color: 'from-purple-500 to-purple-700', light: 'bg-purple-50 border-purple-200', text: 'text-purple-700',
    classes: {
      '1': ['Alphabet & Phonics', 'Simple Words', 'Basic Sentences', 'Greetings & Introductions'],
      '2': ['Reading Simple Stories', 'Nouns & Verbs', 'Simple Sentences', 'Rhymes & Poems'],
      '3': ['Reading Comprehension', 'Parts of Speech', 'Tenses (Present/Past)', 'Paragraph Writing'],
      '4': ['Unseen Passages', 'Grammar: Nouns, Pronouns, Adjectives', 'Letter Writing', 'Story Writing'],
      '5': ['Reading & Comprehension', 'Tenses', 'Active & Passive Voice', 'Formal Letter Writing', 'Essay Writing'],
      '6': ['Prose & Poetry', 'Grammar: All Parts of Speech', 'Paragraph Writing', 'Comprehension Skills'],
      '7': ['Prose, Poetry & Drama', 'Advanced Grammar', 'Essay Writing', 'Reported Speech', 'Vocabulary Building'],
      '8': ['Literature Appreciation', 'Complex Grammar', 'Formal & Informal Letters', 'Notice & Advertisement Writing'],
      '9': ['Beehive: Prose & Poetry', 'Moments: Supplementary Reader', 'Writing Skills', 'Grammar: All Topics', 'Vocabulary'],
      '10': ['First Flight: Prose & Poetry', 'Footprints: Supplementary', 'Letter & Article Writing', 'Grammar', 'Comprehension'],
      '11': ['Hornbill: Prose & Poetry', 'Snapshots', 'Writing Skills', 'Advanced Grammar', 'Report & Speech Writing'],
      '12': ['Flamingo: Prose & Poetry', 'Vistas', 'Notice, Advertisement, Report', 'Debate & Speech', 'Advanced Grammar'],
    },
  },
  'Social Studies': {
    icon: '🌍', color: 'from-amber-500 to-orange-600', light: 'bg-amber-50 border-amber-200', text: 'text-amber-700',
    classes: {
      '1': ['My Family', 'My School', 'My Neighbourhood', 'Festivals of India'],
      '2': ['Our Community', 'Transport & Communication', 'Food & Clothing', 'Occupations'],
      '3': ['Local Government', 'Maps & Directions', 'Natural Resources', 'Famous Indians'],
      '4': ['India: States & Union Territories', 'Rivers of India', 'Agriculture', 'Industries'],
      '5': ['Physical Features of India', 'Indian History: Ancient Civilizations', 'Democracy', 'Natural Vegetation'],
      '6': ['Ancient Civilizations', 'Globe & Maps', 'Motions of Earth', 'India: Climate & Soils', 'Our Past — I'],
      '7': ['Our Pasts — II', 'Social & Political Life — II', 'Our Environment', 'Medieval History of India'],
      '8': ['Our Pasts — III', 'Social & Political Life — III', 'Resources & Development', 'Indian Constitution'],
      '9': ['India & World History', 'Contemporary India — I', 'Democratic Politics — I', 'Economics: Poverty & Food Security'],
      '10': ['India & the Contemporary World — II', 'Contemporary India — II', 'Democratic Politics — II', 'Economics: Development'],
      '11': ['Themes in World History', 'Indian Physical Environment', 'Principles of Political Science', 'Indian Economic Development'],
      '12': ['Contemporary World Politics', 'Politics in India Since Independence', 'Macroeconomics', 'Human Geography'],
    },
  },
};

function SubjectCard({ name, data, onSelect }) {
  return (
    <button onClick={() => onSelect(name)} className="w-full text-left active:scale-[.97] transition-all">
      <div className={`rounded-2xl p-4 border-2 ${data.light} flex items-center gap-4`}>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center text-3xl shadow-sm`}>
          {data.icon}
        </div>
        <div className="flex-1">
          <p className={`font-display font-800 text-lg ${data.text}`}>{name}</p>
          <p className="text-slate-500 text-xs mt-0.5 font-600">Tap to see chapters →</p>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </div>
    </button>
  );
}

function ChapterItem({ chapter, index, isImportant, onOpen }) {
  return (
    <button onClick={() => onOpen(chapter)} className="w-full text-left">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 active:scale-[.98] transition-all hover:border-brand-300">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <span className="font-display font-900 text-slate-500 text-sm">{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="font-display font-800 text-slate-800 text-sm">{chapter}</p>
          {isImportant && (
            <span className="text-[10px] font-700 text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">
              ⭐ Important for exams
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-600 text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">Study</span>
          <ChevronRight size={14} className="text-slate-300" />
        </div>
      </div>
    </button>
  );
}

function ChapterDetail({ chapter, subject, cls, onBack, onAskAI }) {
  const subData = SYLLABUS[subject];
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className={`rounded-2xl p-5 bg-gradient-to-br ${subData.color}`}>
        <p className="text-white/70 text-xs font-700 uppercase tracking-wider mb-1">{subject} · Class {cls}</p>
        <h2 className="text-white font-display font-900 text-xl">{chapter}</h2>
        <div className="flex gap-2 mt-3">
          {['Theory', 'Practice', 'Examples'].map(t => (
            <span key={t} className="bg-white/20 text-white text-[10px] font-700 px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Study options */}
      <div className="space-y-2.5">
        {[
          { emoji: '📖', title: 'Learn the Concept', desc: 'Step-by-step explanation with examples', href: '/learn', color: 'border-brand-200 bg-brand-50' },
          { emoji: '⚡', title: 'Quick Revision', desc: 'Key points & formulas in 5 minutes', href: '/revision', color: 'border-indigo-200 bg-indigo-50' },
          { emoji: '🧠', title: 'Practice Quiz', desc: 'Test your understanding with MCQs', href: '/quiz', color: 'border-purple-200 bg-purple-50' },
          { emoji: '🤖', title: 'Ask AI Doubt Solver', desc: 'Have a question? AI will explain it', action: onAskAI, color: 'border-violet-200 bg-violet-50' },
        ].map(({ emoji, title, desc, href, action, color }) => (
          <button
            key={title}
            onClick={action || (() => {})}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${color} active:scale-[.97] transition-all text-left`}
          >
            <span className="text-2xl">{emoji}</span>
            <div className="flex-1">
              <p className="font-display font-800 text-slate-800 text-sm">{title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* Important notes box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <p className="font-display font-800 text-amber-800 text-sm">Exam Tips for This Chapter</p>
        </div>
        <ul className="space-y-1.5">
          {[
            'Always write formula before solving problems',
            'Draw diagrams where applicable',
            'Revise definitions — they carry easy marks',
            'Practice at least 5 questions from this chapter',
          ].map((tip, i) => (
            <li key={i} className="text-xs text-amber-700 font-600 flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SyllabusPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const cls = user.class || '8';
  const subjectNames = Object.keys(SYLLABUS);

  const handleBack = () => {
    if (selectedChapter) { setSelectedChapter(null); return; }
    if (selectedSubject) { setSelectedSubject(null); return; }
    router.back();
  };

  const handleAskAI = () => {
    const q = `Explain ${selectedChapter} (${selectedSubject}, Class ${cls}) in simple words`;
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  const title = selectedChapter
    ? selectedChapter.length > 20 ? selectedChapter.slice(0, 20) + '…' : selectedChapter
    : selectedSubject || `Class ${cls} Syllabus`;

  return (
    <AppShell title={title} back onBack={handleBack}>
      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Subject list */}
        {!selectedSubject && !selectedChapter && (
          <div className="space-y-4 animate-fade-up">
            {/* Class badge */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-brand-400" />
              </div>
              <div>
                <p className="text-white font-display font-900 text-lg">Class {cls} Syllabus</p>
                <p className="text-slate-400 text-xs mt-0.5">Select a subject to see chapters</p>
              </div>
            </div>

            <p className="font-display font-800 text-slate-700 text-sm">Choose a Subject</p>
            <div className="space-y-3">
              {subjectNames.map(name => (
                <SubjectCard
                  key={name}
                  name={name}
                  data={SYLLABUS[name]}
                  onSelect={setSelectedSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chapter list */}
        {selectedSubject && !selectedChapter && (
          <div className="space-y-3 animate-fade-up">
            <div className={`rounded-2xl p-4 bg-gradient-to-br ${SYLLABUS[selectedSubject].color} flex items-center gap-3`}>
              <span className="text-3xl">{SYLLABUS[selectedSubject].icon}</span>
              <div>
                <p className="text-white font-display font-900 text-lg">{selectedSubject}</p>
                <p className="text-white/70 text-xs">Class {cls} · {SYLLABUS[selectedSubject].classes[cls]?.length || 0} chapters</p>
              </div>
            </div>

            <p className="font-display font-800 text-slate-700 text-sm px-1">Chapters</p>
            <div className="space-y-2">
              {(SYLLABUS[selectedSubject].classes[cls] || []).map((ch, i) => (
                <ChapterItem
                  key={ch}
                  chapter={ch}
                  index={i}
                  isImportant={i < 3}
                  onOpen={setSelectedChapter}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chapter detail */}
        {selectedSubject && selectedChapter && (
          <ChapterDetail
            chapter={selectedChapter}
            subject={selectedSubject}
            cls={cls}
            onBack={() => setSelectedChapter(null)}
            onAskAI={handleAskAI}
          />
        )}
      </div>
    </AppShell>
  );
}
