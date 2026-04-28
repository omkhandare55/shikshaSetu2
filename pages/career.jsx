// pages/career.jsx — Full Career Guidance Module with roadmaps (i18n)
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Target, Briefcase, GraduationCap, ChevronRight, Star,
  TrendingUp, Sparkles, MoveRight, BookOpen, Code, FlaskConical,
  Stethoscope, Calculator, PenTool, Megaphone, X, CheckCircle2,
  Award, Clock, Globe, Users, Lightbulb,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

const CAREERS = [
  {
    id: 'software',
    titleKey: 'career_se',
    industryKey: 'career_ind_tech',
    match: '95%',
    icon: Code,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    gradient: 'from-blue-400 to-blue-600',
    salary: '₹3–20 LPA',
    growthKey: 'career_growth_vhigh',
    descKey: 'career_se_desc',
    subjects: ['Mathematics', 'Science', 'English'],
    roadmap: [
      { step: 1, titleKey: 'career_step1', actionKey: 'career_se_s1', timeKey: 'career_t_now' },
      { step: 2, titleKey: 'career_step2', actionKey: 'career_se_s2', timeKey: 'career_t_2y' },
      { step: 3, titleKey: 'career_step3_tech', actionKey: 'career_se_s3', timeKey: 'career_t_4y' },
      { step: 4, titleKey: 'career_step4_intern', actionKey: 'career_se_s4', timeKey: 'career_t_1y' },
      { step: 5, titleKey: 'career_step5_job', actionKey: 'career_se_s5', timeKey: 'career_t_after' },
    ],
    skills: ['Problem Solving', 'Logical Thinking', 'Mathematics', 'Basic English', 'Computer Basics'],
    freeResources: ['NPTEL online courses', 'FreeCodeCamp.org', 'YouTube tutorials', 'Coursera free tier'],
  },
  {
    id: 'doctor',
    titleKey: 'career_dr',
    industryKey: 'career_ind_health',
    match: '88%',
    icon: Stethoscope,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
    gradient: 'from-emerald-400 to-emerald-600',
    salary: '₹5–25 LPA',
    growthKey: 'career_growth_high',
    descKey: 'career_dr_desc',
    subjects: ['Science', 'Mathematics', 'English'],
    roadmap: [
      { step: 1, titleKey: 'career_step1', actionKey: 'career_dr_s1', timeKey: 'career_t_now' },
      { step: 2, titleKey: 'career_step2', actionKey: 'career_dr_s2', timeKey: 'career_t_2y' },
      { step: 3, titleKey: 'career_step3_neet', actionKey: 'career_dr_s3', timeKey: 'career_t_1_2y' },
      { step: 4, titleKey: 'career_step4_mbbs', actionKey: 'career_dr_s4', timeKey: 'career_t_5y' },
      { step: 5, titleKey: 'career_step5_dr', actionKey: 'career_dr_s5', timeKey: 'career_t_after' },
    ],
    skills: ['Biology', 'Chemistry', 'Patience', 'Communication', 'Memorization'],
    freeResources: ['NCERT Textbooks', 'Unacademy NEET free classes', 'PW (Physics Wallah)', 'Khan Academy'],
  },
  {
    id: 'teacher',
    titleKey: 'career_tch',
    industryKey: 'career_ind_edu',
    match: '85%',
    icon: GraduationCap,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
    gradient: 'from-purple-400 to-purple-600',
    salary: '₹2–8 LPA',
    growthKey: 'career_growth_stable',
    descKey: 'career_tch_desc',
    subjects: ['All Subjects', 'English'],
    roadmap: [
      { step: 1, titleKey: 'career_step1', actionKey: 'career_tch_s1', timeKey: 'career_t_now' },
      { step: 2, titleKey: 'career_step2', actionKey: 'career_tch_s2', timeKey: 'career_t_2y' },
      { step: 3, titleKey: 'career_step3_grad', actionKey: 'career_tch_s3', timeKey: 'career_t_3y' },
      { step: 4, titleKey: 'career_step4_bed', actionKey: 'career_tch_s4', timeKey: 'career_t_2y' },
      { step: 5, titleKey: 'career_step5_tch', actionKey: 'career_tch_s5', timeKey: 'career_t_afterbed' },
    ],
    skills: ['Subject Knowledge', 'Communication', 'Patience', 'Leadership', 'Creativity'],
    freeResources: ['DIKSHA App (Govt)', 'NCERT Learning', 'CTET Study Material', 'State Board Resources'],
  },
  {
    id: 'engineer',
    titleKey: 'career_eng',
    industryKey: 'career_ind_infra',
    match: '80%',
    icon: Calculator,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
    gradient: 'from-amber-400 to-amber-600',
    salary: '₹3–15 LPA',
    growthKey: 'career_growth_high',
    descKey: 'career_eng_desc',
    subjects: ['Mathematics', 'Science'],
    roadmap: [
      { step: 1, titleKey: 'career_step1', actionKey: 'career_eng_s1', timeKey: 'career_t_now' },
      { step: 2, titleKey: 'career_step2', actionKey: 'career_eng_s2', timeKey: 'career_t_2y' },
      { step: 3, titleKey: 'career_step3_dip', actionKey: 'career_eng_s3', timeKey: 'career_t_3_4y' },
      { step: 4, titleKey: 'career_step4_intern', actionKey: 'career_eng_s4', timeKey: 'career_t_6m' },
      { step: 5, titleKey: 'career_step5_eng', actionKey: 'career_eng_s5', timeKey: 'career_t_after' },
    ],
    skills: ['Mathematics', 'Physics', 'Technical Drawing', 'Analytical Thinking', 'Problem Solving'],
    freeResources: ['NPTEL courses', 'MIT OpenCourseWare', 'YouTube engineering channels', 'Government ITI'],
  },
  {
    id: 'journalist',
    titleKey: 'career_journo',
    industryKey: 'career_ind_media',
    match: '74%',
    icon: PenTool,
    color: 'text-rose-500',
    bg: 'bg-rose-100',
    gradient: 'from-rose-400 to-rose-600',
    salary: '₹2–10 LPA',
    growthKey: 'career_growth_mod',
    descKey: 'career_journo_desc',
    subjects: ['English', 'Social Science'],
    roadmap: [
      { step: 1, titleKey: 'career_step1', actionKey: 'career_journo_s1', timeKey: 'career_t_now' },
      { step: 2, titleKey: 'career_step2', actionKey: 'career_journo_s2', timeKey: 'career_t_2y' },
      { step: 3, titleKey: 'career_step3_journo', actionKey: 'career_journo_s3', timeKey: 'career_t_3y' },
      { step: 4, titleKey: 'career_step4_intern', actionKey: 'career_journo_s4', timeKey: 'career_t_6m' },
      { step: 5, titleKey: 'career_step5_journo', actionKey: 'career_journo_s5', timeKey: 'career_t_after' },
    ],
    skills: ['Writing', 'English', 'Curiosity', 'Research', 'Communication'],
    freeResources: ['Free journalism courses online', 'Start a blog', 'Read newspapers daily', 'BBC Learn English'],
  },
];

const QUIZ_QUESTIONS = [
  { qKey: 'career_q1', optionsKey: 'career_q1_opts' },
  { qKey: 'career_q2', optionsKey: 'career_q2_opts' },
  { qKey: 'career_q3', optionsKey: 'career_q3_opts' },
];

function CareerRoadmapModal({ career, onClose, t }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col" onClick={onClose}>
      <div className="mt-10 bg-white rounded-t-3xl flex-1 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className={`px-5 pt-6 pb-4 bg-gradient-to-br ${career.gradient}`}>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <X size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl ${career.bg} flex items-center justify-center`}>
              <career.icon size={24} className={career.color} />
            </div>
            <div>
              <h3 className="text-white font-display font-900 text-xl">{t(career.titleKey)}</h3>
              <p className="text-white/70 text-xs font-600">{t(career.industryKey)}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="bg-white/20 text-white text-[11px] font-700 px-3 py-1 rounded-full">💰 {career.salary}</span>
            <span className="bg-white/20 text-white text-[11px] font-700 px-3 py-1 rounded-full">📈 {t(career.growthKey)}</span>
          </div>
        </div>

        <div className="px-5 py-5 space-y-6 pb-10">
          <p className="text-slate-600 text-sm font-500 leading-relaxed">{t(career.descKey)}</p>

          <div>
            <h4 className="font-display font-800 text-slate-800 text-base mb-4 flex items-center gap-2">
              <Target size={18} className="text-brand-500" /> {t('career_roadmap')}
            </h4>
            <div className="relative space-y-4">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
              {career.roadmap.map((step, i) => (
                <div key={step.step} className="flex gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-900 shrink-0 z-10 ${
                    i === 0 ? 'bg-brand-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-500'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-800 text-slate-800 text-sm">{t(step.titleKey)}</p>
                      <span className="text-[10px] font-700 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={9} /> {t(step.timeKey)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-600 leading-relaxed">{t(step.actionKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-800 text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" /> {t('career_skills')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {career.skills.map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-600 text-xs font-700 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-brand-500" /> {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-800 text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Globe size={16} className="text-indigo-500" /> {t('career_resources')}
            </h4>
            <div className="space-y-2">
              {career.freeResources.map(r => (
                <div key={r} className="flex items-center gap-2.5 bg-indigo-50 rounded-xl p-3">
                  <BookOpen size={14} className="text-indigo-500 shrink-0" />
                  <p className="text-xs text-indigo-700 font-700">{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-800 text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Award size={16} className="text-brand-500" /> {t('career_subjects')}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {career.subjects.map(subj => (
                <span key={subj} className="bg-brand-100 text-brand-700 text-xs font-800 px-3 py-1.5 rounded-full">
                  {subj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeCareer, setActiveCareer] = useState(null);
  const [quizStep, setQuizStep] = useState(null); // null | 0,1,2 | 'done'
  const [quizAnswers, setQuizAnswers] = useState([]);

  const handleQuizAnswer = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (newAnswers.length >= QUIZ_QUESTIONS.length) {
      setQuizStep('done');
    } else {
      setQuizStep(newAnswers.length);
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-28 space-y-6">
        <div className="flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <h2 className="font-display font-900 text-2xl text-slate-900 leading-tight">{t('career_title')}</h2>
              <p className="text-sm font-500 text-slate-500">{t('career_sub')}</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
            <GraduationCap size={24} className="text-indigo-600" />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-amber-400" />
            <p className="text-indigo-200 text-sm font-700">{t('career_assess')}</p>
          </div>
          {quizStep === null && (
            <>
              <h3 className="text-white font-display font-900 text-2xl mb-2">{t('career_find')}</h3>
              <p className="text-indigo-200 text-sm mb-5">{t('career_assessSub')}</p>
              <button
                onClick={() => setQuizStep(0)}
                className="bg-white text-indigo-600 px-5 py-3 rounded-xl font-800 text-sm flex items-center gap-2 active:scale-95 transition-transform"
              >
                {t('career_start')} <MoveRight size={16} />
              </button>
            </>
          )}
          {quizStep !== null && quizStep !== 'done' && (
            <>
              <p className="text-indigo-200 text-xs font-700 mb-2">{t('career_qNum', { current: quizStep + 1, total: QUIZ_QUESTIONS.length })}</p>
              <p className="text-white font-display font-800 text-lg mb-4 leading-snug">{t(QUIZ_QUESTIONS[quizStep].qKey)}</p>
              <div className="space-y-2.5">
                {t(QUIZ_QUESTIONS[quizStep].optionsKey).map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleQuizAnswer(opt)}
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-700 px-4 py-3 rounded-xl text-left active:scale-[.98] transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
          {quizStep === 'done' && (
            <>
              <h3 className="text-white font-display font-900 text-xl mb-2">✅ {t('career_done')}</h3>
              <p className="text-indigo-200 text-sm mb-4">{t('career_doneSub')}</p>
              <button
                onClick={() => { setQuizStep(null); setQuizAnswers([]); }}
                className="bg-white/20 text-white text-sm font-700 px-4 py-2 rounded-lg active:scale-95 transition-transform"
              >
                {t('career_retake')}
              </button>
            </>
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <h3 className="font-display font-800 text-slate-800 text-base mb-4">
            {quizStep === 'done' ? `🎯 ${t('career_matches')}` : `🌟 ${t('career_explore')}`}
          </h3>
          <div className="space-y-4">
            {CAREERS.map((career) => {
              const Icon = career.icon;
              return (
                <div key={career.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${career.bg}`}>
                      <Icon size={24} className={career.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-display font-800 text-lg text-slate-800">{t(career.titleKey)}</p>
                          <p className="text-xs font-600 text-slate-400">{t(career.industryKey)}</p>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-800 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                          <Star size={11} className="fill-amber-600" /> {career.match}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-500 leading-relaxed mb-3">{t(career.descKey)}</p>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className="text-[10px] font-700 bg-slate-100 text-slate-600 px-2 py-1 rounded-full">💰 {career.salary}</span>
                        <span className="text-[10px] font-700 bg-slate-100 text-slate-600 px-2 py-1 rounded-full">📈 {t(career.growthKey)}</span>
                      </div>
                      <button
                        onClick={() => setActiveCareer(career)}
                        className="w-full bg-slate-900 text-white rounded-xl py-2.5 text-sm font-800 flex items-center justify-center gap-2 active:scale-[.98] transition-transform"
                      >
                        {t('career_viewMap')} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-100 rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-brand-600" />
            <p className="font-display font-800 text-slate-800 text-sm">{t('career_story')}</p>
          </div>
          <p className="text-xs text-slate-600 font-600 leading-relaxed italic">
            "{t('career_storyTxt')}" — <span className="font-800 text-brand-700">{t('career_storyName')}</span>
          </p>
        </div>
      </div>

      {activeCareer && (
        <CareerRoadmapModal career={activeCareer} onClose={() => setActiveCareer(null)} t={t} />
      )}
    </AppShell>
  );
}
