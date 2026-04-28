// pages/courses.jsx — GraamVidya | Certification Courses (Class 1-12)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import {
  Award, BookOpen, ChevronRight, CheckCircle2, Lock, Star,
  Zap, Clock, Users, Play, Trophy, Sparkles, Target, TrendingUp,
} from 'lucide-react';

// ── Course Data ───────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 'math-foundations',
    emoji: '📐',
    title: 'Mathematics Foundations',
    subtitle: 'Class 1–5',
    description: 'Master numbers, arithmetic, shapes, and basic algebra with step-by-step lessons.',
    color: 'from-brand-500 to-brand-700',
    lightBg: 'bg-brand-50 border-brand-200',
    textColor: 'text-brand-700',
    chapters: 12, xpReward: 500, students: 1842, difficulty: 'Beginner',
    free: true, certificate: true,
    topics: ['Counting & Numbers', 'Addition & Subtraction', 'Multiplication & Division', 'Fractions', 'Shapes & Geometry', 'Time & Money'],
  },
  {
    id: 'math-intermediate',
    emoji: '📊',
    title: 'Mathematics Intermediate',
    subtitle: 'Class 6–8',
    description: 'Integers, equations, geometry, and data handling for middle school students.',
    color: 'from-indigo-500 to-indigo-700',
    lightBg: 'bg-indigo-50 border-indigo-200',
    textColor: 'text-indigo-700',
    chapters: 14, xpReward: 700, students: 1234, difficulty: 'Intermediate',
    free: true, certificate: true,
    topics: ['Integers & Rational Numbers', 'Linear Equations', 'Lines & Angles', 'Triangles', 'Mensuration', 'Data Handling'],
  },
  {
    id: 'math-board',
    emoji: '🔢',
    title: 'Mathematics Board Prep',
    subtitle: 'Class 9–10',
    description: 'Polynomials, quadratics, trigonometry, statistics — complete Class 10 prep.',
    color: 'from-violet-500 to-purple-700',
    lightBg: 'bg-violet-50 border-violet-200',
    textColor: 'text-violet-700',
    chapters: 15, xpReward: 1000, students: 2841, difficulty: 'Advanced',
    free: false, certificate: true,
    topics: ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Trigonometry', 'Statistics', 'Probability'],
  },
  {
    id: 'science-foundations',
    emoji: '🔬',
    title: 'Science Foundations',
    subtitle: 'Class 1–5',
    description: 'Explore living things, our body, plants, animals, and the world around us.',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-700',
    chapters: 10, xpReward: 400, students: 1527, difficulty: 'Beginner',
    free: true, certificate: true,
    topics: ['Living & Non-Living Things', 'Plants & Animals', 'Our Body', 'Air & Water', 'Force & Energy'],
  },
  {
    id: 'science-board',
    emoji: '⚡',
    title: 'Science Board Mastery',
    subtitle: 'Class 9–10',
    description: 'Physics, Chemistry & Biology — complete Class 10 Science with solved exercises.',
    color: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50 border-rose-200',
    textColor: 'text-rose-700',
    chapters: 16, xpReward: 1100, students: 3102, difficulty: 'Advanced',
    free: false, certificate: true,
    topics: ['Chemical Reactions', 'Acids & Bases', 'Metals & Non-Metals', 'Life Processes', 'Electricity', 'Light', 'Heredity'],
  },
  {
    id: 'english-basics',
    emoji: '📚',
    title: 'English Communication',
    subtitle: 'Class 3–7',
    description: 'Grammar, comprehension, writing skills and vocabulary building.',
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-700',
    chapters: 10, xpReward: 500, students: 2091, difficulty: 'Beginner',
    free: true, certificate: true,
    topics: ['Parts of Speech', 'Tenses', 'Active & Passive Voice', 'Letter Writing', 'Essay Writing', 'Comprehension'],
  },
  {
    id: 'english-board',
    emoji: '✍️',
    title: 'English Board Excellence',
    subtitle: 'Class 10–12',
    description: 'Literature, advanced grammar, formal writing, and comprehension for boards.',
    color: 'from-cyan-500 to-blue-600',
    lightBg: 'bg-cyan-50 border-cyan-200',
    textColor: 'text-cyan-700',
    chapters: 12, xpReward: 900, students: 1843, difficulty: 'Advanced',
    free: false, certificate: true,
    topics: ['Prose & Poetry Analysis', 'Formal Letter & Article', 'Debate & Speech', 'Report Writing', 'Advanced Grammar'],
  },
  {
    id: 'social-studies',
    emoji: '🌍',
    title: 'Social Studies Complete',
    subtitle: 'Class 6–10',
    description: 'History, Geography, Civics & Economics — fully aligned with NCERT syllabus.',
    color: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-700',
    chapters: 14, xpReward: 800, students: 1456, difficulty: 'Intermediate',
    free: true, certificate: true,
    topics: ['Ancient History', 'Medieval History', 'Maps & Geography', 'Indian Constitution', 'Economics Basics'],
  },
];

// ── Chapter Detail View ───────────────────────────────────────────────────────
function CourseDetail({ course, onBack, onEnroll, isEnrolled }) {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const SAMPLE_CHAPTERS = course.topics.map((t, i) => ({
    num: i + 1,
    title: t,
    duration: `${8 + i * 2} min`,
    xp: 50 + i * 10,
    locked: !isEnrolled && i > 1,
  }));

  return (
    <div className="space-y-4 animate-fade-up px-4 pt-4 pb-8">
      {/* Hero */}
      <div className={`rounded-3xl p-6 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <span className="text-5xl block mb-3">{course.emoji}</span>
          <p className="text-white/70 text-xs font-700 uppercase tracking-wider">{course.subtitle}</p>
          <h2 className="text-white font-display font-900 text-2xl mt-1">{course.title}</h2>
          <p className="text-white/70 text-sm mt-2">{course.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <BookOpen size={12} /> {course.chapters} Chapters
            </span>
            <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Zap size={12} /> {course.xpReward} XP
            </span>
            <span className="bg-white/20 text-white text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Users size={12} /> {course.students.toLocaleString()} students
            </span>
            <span className={`text-xs font-800 px-3 py-1.5 rounded-full ${course.free ? 'bg-emerald-400/30 text-white' : 'bg-amber-400/30 text-white'}`}>
              {course.free ? '🆓 FREE' : '💳 Premium'}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate badge */}
      <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
          <Award size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-display font-800 text-amber-800">Certificate on Completion</p>
          <p className="text-amber-600 text-xs mt-0.5">Earn a verified achievement certificate after passing all chapter tests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        {['overview', 'chapters', 'exams'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-800 capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {tab === 'overview' ? '📋 Overview' : tab === 'chapters' ? '📖 Chapters' : '📝 Exams'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="card">
            <p className="font-display font-800 text-slate-700 text-sm mb-3">📚 What You'll Learn</p>
            <div className="space-y-2">
              {course.topics.map((t, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <p className="text-slate-700 text-sm font-600">{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="font-700 text-slate-600 text-sm mb-2">⚠️ AI Tutor Note</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              All content in this course is verified and aligned with the Maharashtra State Board & NCERT syllabus.
              Our AI Tutor answers ONLY from this verified content — no random or internet-based answers.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="space-y-2">
          {SAMPLE_CHAPTERS.map(ch => (
            <button key={ch.num}
              onClick={() => !ch.locked && router.push('/learn')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${ch.locked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-brand-300 active:scale-[.98]'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ch.locked ? 'bg-slate-100' : 'bg-brand-100'}`}>
                {ch.locked
                  ? <Lock size={16} className="text-slate-400" />
                  : <span className="font-display font-900 text-brand-700 text-sm">{ch.num}</span>}
              </div>
              <div className="flex-1">
                <p className={`font-display font-800 text-sm ${ch.locked ? 'text-slate-400' : 'text-slate-800'}`}>{ch.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock size={9} /> {ch.duration}</span>
                  <span className="text-[10px] text-amber-600 font-700 flex items-center gap-0.5"><Zap size={9} /> +{ch.xp} XP</span>
                </div>
              </div>
              {ch.locked
                ? <Lock size={14} className="text-slate-300 shrink-0" />
                : <ChevronRight size={14} className="text-slate-300 shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-3">
          <div className="card">
            <p className="font-display font-800 text-slate-700 text-sm mb-3">📝 Chapter Tests</p>
            <p className="text-slate-500 text-xs mb-4">Auto-generated tests based on chapter content. Score 70%+ to unlock next chapter!</p>
            <div className="space-y-2.5">
              {['Chapter Quiz (10 MCQ)', 'Mid-Course Test (25 Q)', 'Final Exam (40 Q)'].map((exam, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 && isEnrolled ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 && isEnrolled ? 'bg-brand-500' : 'bg-slate-300'}`}>
                    <Trophy size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-700 text-slate-700">{exam}</p>
                    <p className="text-[10px] text-slate-400 font-600">Pass to earn certificate credit</p>
                  </div>
                  <span className={`text-[10px] font-800 px-2 py-0.5 rounded-full ${!isEnrolled ? 'bg-slate-100 text-slate-400' : i === 0 ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-400'}`}>
                    {!isEnrolled ? 'Enroll first' : i === 0 ? 'Start' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-700 text-amber-700 text-xs mb-1">🏆 Certificate Awarded When:</p>
            <ul className="space-y-1">
              {['Complete all chapter lessons', 'Score 70%+ in Final Exam', 'Complete at least 2 chapter quizzes'].map(c => (
                <li key={c} className="text-amber-600 text-xs font-600 flex items-start gap-1.5">
                  <span className="text-amber-400 mt-0.5">✓</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Enroll button */}
      <button
        onClick={onEnroll}
        className={`w-full py-4 rounded-2xl font-display font-800 text-lg transition-all active:scale-[.97] shadow-lg ${
          isEnrolled
            ? 'bg-emerald-500 text-white'
            : course.free
            ? 'bg-brand-700 text-white shadow-glow'
            : 'bg-saffron-500 text-white shadow-glow-saffron'
        }`}
      >
        {isEnrolled ? '✅ Continue Learning' : course.free ? '🚀 Enroll for Free' : '💳 Enroll (Premium)'}
      </button>
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────
function CourseCard({ course, isEnrolled, onTap, animDelay }) {
  return (
    <button
      onClick={onTap}
      className="w-full text-left animate-pop"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 active:scale-[.97] transition-all hover:shadow-md">
        {/* Top gradient */}
        <div className={`bg-gradient-to-r ${course.color} p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="text-3xl">{course.emoji}</span>
              <p className="text-white font-display font-900 text-lg mt-1 leading-tight">{course.title}</p>
              <p className="text-white/70 text-xs mt-0.5">{course.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {course.free
                ? <span className="bg-emerald-400/40 text-white text-[10px] font-800 px-2.5 py-1 rounded-full">🆓 FREE</span>
                : <span className="bg-amber-400/40 text-white text-[10px] font-800 px-2.5 py-1 rounded-full">💳 Premium</span>}
              {isEnrolled && <span className="bg-white/30 text-white text-[10px] font-800 px-2 py-0.5 rounded-full">Enrolled ✓</span>}
            </div>
          </div>
        </div>
        {/* Bottom info */}
        <div className="p-4">
          <p className="text-slate-500 text-xs font-600 leading-relaxed mb-3">{course.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-700 text-slate-500 flex items-center gap-1">
              <BookOpen size={10} /> {course.chapters} chapters
            </span>
            <span className="text-[10px] font-700 text-amber-600 flex items-center gap-1">
              <Zap size={10} /> {course.xpReward} XP
            </span>
            <span className="text-[10px] font-700 text-slate-500 flex items-center gap-1">
              <Users size={10} /> {course.students.toLocaleString()}
            </span>
            <span className="text-[10px] font-700 text-slate-400 ml-auto">{course.difficulty}</span>
          </div>
          {/* Progress if enrolled */}
          {isEnrolled && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400 font-600">Progress</span>
                <span className="text-brand-600 font-700">25%</span>
              </div>
              <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${course.color}`} style={{ width: '25%' }} />
              </div>
            </div>
          )}
          {/* Certificate badge */}
          <div className="mt-3 flex items-center gap-1.5">
            <Award size={12} className="text-amber-500" />
            <span className="text-[10px] font-700 text-amber-600">Achievement Certificate on completion</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [filter, setFilter] = useState('All'); // All | Free | Enrolled

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      try {
        const ids = JSON.parse(localStorage.getItem(`gv_enrolled_${user.uid}`) || '[]');
        setEnrolledIds(ids);
      } catch {}
    }
  }, [user, loading]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const handleEnroll = (course) => {
    if (!enrolledIds.includes(course.id)) {
      const newIds = [...enrolledIds, course.id];
      setEnrolledIds(newIds);
      localStorage.setItem(`gv_enrolled_${user.uid}`, JSON.stringify(newIds));
    }
    router.push('/learn');
  };

  const filtered = COURSES.filter(c => {
    if (filter === 'Free') return c.free;
    if (filter === 'Enrolled') return enrolledIds.includes(c.id);
    return true;
  });

  if (selectedCourse) {
    return (
      <AppShell title={selectedCourse.title} back onBack={() => setSelectedCourse(null)}>
        <CourseDetail
          course={selectedCourse}
          isEnrolled={enrolledIds.includes(selectedCourse.id)}
          onBack={() => setSelectedCourse(null)}
          onEnroll={() => handleEnroll(selectedCourse)}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Certification Courses">
      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Hero */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-brand-700 to-indigo-700 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-display font-900 text-xl">Certification Courses</p>
                <p className="text-white/70 text-xs">Class 1-12 · All Subjects · Real Certificates</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['🆓 Free courses', '📜 Real certificates', '🤖 AI Tutor', '📱 Offline-ready'].map(tag => (
                <span key={tag} className="bg-white/20 text-white text-[11px] font-700 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {[
            { label: 'Courses', value: COURSES.length, icon: BookOpen, color: 'text-brand-500', bg: 'bg-brand-50' },
            { label: 'Enrolled', value: enrolledIds.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Free Courses', value: COURSES.filter(c => c.free).length, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-center">
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${s.bg} mb-1`}>
                <s.icon size={16} className={s.color} />
              </div>
              <p className={`font-900 text-lg font-display ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 font-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {['All', 'Free', 'Enrolled'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-700 transition-all ${filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
              {f === 'All' ? '📚 All' : f === 'Free' ? '🆓 Free' : '✅ Enrolled'}
            </button>
          ))}
        </div>

        {/* Real-info disclaimer */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 text-xs font-700">Verified Content Only</p>
            <p className="text-blue-600 text-[11px] mt-0.5 leading-relaxed">
              All course content is aligned with Maharashtra State Board & NCERT syllabus. No fake or random AI information.
            </p>
          </div>
        </div>

        {/* Course list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📚</div>
              <p className="font-display font-800 text-slate-700">No courses found</p>
              <button onClick={() => setFilter('All')} className="mt-3 text-brand-700 font-700 text-sm">See all courses</button>
            </div>
          ) : (
            filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledIds.includes(course.id)}
                onTap={() => setSelectedCourse(course)}
                animDelay={120 + i * 40}
              />
            ))
          )}
        </div>

      </div>
    </AppShell>
  );
}
