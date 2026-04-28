// services/certificateData.js — Certificate definitions and award logic

export const CERTIFICATE_TYPES = {
  // ── Subject Completion ──────────────────────────────
  subject_math: {
    id: 'subject_math',
    title: 'Mathematics Champion',
    titleMr: 'गणित चॅम्पियन',
    subject: 'Mathematics',
    emoji: '📐',
    color: 'from-brand-500 to-brand-700',
    accentColor: '#3b6cf7',
    description: 'Successfully completed all Mathematics lessons',
    category: 'subject',
    xpReward: 200,
  },
  subject_science: {
    id: 'subject_science',
    title: 'Science Explorer',
    titleMr: 'विज्ञान एक्सप्लोरर',
    subject: 'Science',
    emoji: '🔬',
    color: 'from-indigo-500 to-indigo-700',
    accentColor: '#6366f1',
    description: 'Successfully completed all Science lessons',
    category: 'subject',
    xpReward: 200,
  },
  subject_english: {
    id: 'subject_english',
    title: 'English Master',
    titleMr: 'इंग्रजी मास्टर',
    subject: 'English',
    emoji: '📚',
    color: 'from-purple-500 to-purple-700',
    accentColor: '#a855f7',
    description: 'Successfully completed all English lessons',
    category: 'subject',
    xpReward: 200,
  },
  // ── Learning Milestones ─────────────────────────────
  lessons_5: {
    id: 'lessons_5',
    title: 'Quick Learner',
    titleMr: 'जलद शिकणारा',
    emoji: '⚡',
    color: 'from-amber-400 to-orange-500',
    accentColor: '#f59e0b',
    description: 'Completed 5 micro-lessons with dedication',
    category: 'milestone',
    xpReward: 75,
  },
  lessons_10: {
    id: 'lessons_10',
    title: 'Dedicated Scholar',
    titleMr: 'समर्पित विद्यार्थी',
    emoji: '🎓',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    description: 'Completed 10 lessons — a true scholar!',
    category: 'milestone',
    xpReward: 150,
  },
  lessons_25: {
    id: 'lessons_25',
    title: 'Knowledge Hero',
    titleMr: 'ज्ञान नायक',
    emoji: '🦸',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e',
    description: 'Completed 25 lessons — exceptional commitment!',
    category: 'milestone',
    xpReward: 300,
  },
  // ── Quiz Excellence ─────────────────────────────────
  quiz_excellence: {
    id: 'quiz_excellence',
    title: 'Quiz Excellence',
    titleMr: 'क्विझ उत्कृष्टता',
    emoji: '🧠',
    color: 'from-violet-500 to-purple-700',
    accentColor: '#8b5cf6',
    description: 'Scored 80% or above in 5 quizzes',
    category: 'quiz',
    xpReward: 100,
  },
  quiz_perfect: {
    id: 'quiz_perfect',
    title: 'Perfect Score',
    titleMr: 'परिपूर्ण गुण',
    emoji: '💯',
    color: 'from-yellow-400 to-amber-500',
    accentColor: '#eab308',
    description: 'Achieved 100% score in a quiz',
    category: 'quiz',
    xpReward: 150,
  },
  // ── Streak ──────────────────────────────────────────
  streak_7: {
    id: 'streak_7',
    title: '7-Day Streak Champion',
    titleMr: '७ दिवस सलग शिक्षण',
    emoji: '🔥',
    color: 'from-saffron-400 to-rose-500',
    accentColor: '#f97316',
    description: 'Maintained a 7-day learning streak',
    category: 'streak',
    xpReward: 100,
  },
  streak_30: {
    id: 'streak_30',
    title: 'Monthly Learning Legend',
    titleMr: 'मासिक शिक्षण दंतकथा',
    emoji: '💎',
    color: 'from-slate-700 to-slate-900',
    accentColor: '#334155',
    description: 'Maintained 30 consecutive days of learning',
    category: 'streak',
    xpReward: 500,
  },
  // ── Saturday Test ────────────────────────────────────
  saturday_champ: {
    id: 'saturday_champ',
    title: 'Saturday Test Champion',
    titleMr: 'शनिवार परीक्षा विजेता',
    emoji: '🏆',
    color: 'from-amber-500 to-orange-600',
    accentColor: '#d97706',
    description: 'Won the Weekly Saturday Practice Test',
    category: 'contest',
    xpReward: 250,
  },
  // ── Voice ────────────────────────────────────────────
  voice_speaker: {
    id: 'voice_speaker',
    title: 'Confident Speaker',
    titleMr: 'आत्मविश्वासू वक्ता',
    emoji: '🎤',
    color: 'from-teal-500 to-cyan-600',
    accentColor: '#14b8a6',
    description: 'Completed 7 English voice practice sessions',
    category: 'voice',
    xpReward: 100,
  },
};

// Check which certificates a student has earned
export function getEarnedCertificates(progress = {}, lessonProgress = {}) {
  const earned = [];
  const certs = CERTIFICATE_TYPES;

  const xp = progress.xp || 0;
  const streak = progress.streak || 0;
  const lessons = progress.lessonsCompleted || lessonProgress.totalCompleted || 0;
  const quizSessions = progress.quizSessions || 0;
  const quizPerfect = progress.quizPerfect || false;
  const voiceSessions = progress.voiceSessions || 0;
  const contestWins = progress.contestWins || 0;
  const completedSubjects = progress.completedSubjects || [];

  // Subject completion
  if (completedSubjects.includes('Mathematics')) earned.push(certs.subject_math);
  if (completedSubjects.includes('Science'))     earned.push(certs.subject_science);
  if (completedSubjects.includes('English'))     earned.push(certs.subject_english);

  // Lesson milestones
  if (lessons >= 5)  earned.push(certs.lessons_5);
  if (lessons >= 10) earned.push(certs.lessons_10);
  if (lessons >= 25) earned.push(certs.lessons_25);

  // Quiz
  if (quizSessions >= 5) earned.push(certs.quiz_excellence);
  if (quizPerfect)        earned.push(certs.quiz_perfect);

  // Streak
  if (streak >= 7)  earned.push(certs.streak_7);
  if (streak >= 30) earned.push(certs.streak_30);

  // Saturday
  if (contestWins >= 1) earned.push(certs.saturday_champ);

  // Voice
  if (voiceSessions >= 7) earned.push(certs.voice_speaker);

  return earned;
}

// All possible certificates (for "locked" view)
export const ALL_CERTIFICATES = Object.values(CERTIFICATE_TYPES);

// How to unlock each certificate
export const UNLOCK_HINTS = {
  subject_math:     'Complete all Mathematics lessons in the Learn section',
  subject_science:  'Complete all Science lessons in the Learn section',
  subject_english:  'Complete all English lessons in the Learn section',
  lessons_5:        'Complete 5 micro-lessons in the Learn section',
  lessons_10:       'Complete 10 micro-lessons in the Learn section',
  lessons_25:       'Complete 25 micro-lessons in the Learn section',
  quiz_excellence:  'Score 80%+ in 5 daily quizzes',
  quiz_perfect:     'Get 100% in any quiz',
  streak_7:         'Log in and learn for 7 days in a row',
  streak_30:        'Maintain a 30-day learning streak',
  saturday_champ:   'Win a Saturday Weekly Test',
  voice_speaker:    'Complete 7 Voice Practice sessions',
};
