// pages/certificates.jsx — My Certificates (All earned + locked)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Award, Lock, ChevronRight, Trophy, Star } from 'lucide-react';
import { getEarnedCertificates, ALL_CERTIFICATES, UNLOCK_HINTS } from '../services/certificateData';

function CertCard({ cert, earned, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left active:scale-[.97] transition-all animate-pop ${!earned ? 'opacity-60' : ''}`}
    >
      <div className={`rounded-2xl overflow-hidden shadow-sm border-2 ${earned ? 'border-amber-200' : 'border-slate-100'}`}>
        {/* Gradient top */}
        <div className={`bg-gradient-to-r ${cert.color} p-4 flex items-center gap-3`}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
            {earned ? cert.emoji : <Lock size={22} className="text-white/70" />}
          </div>
          <div className="flex-1">
            <p className="text-white font-display font-900 text-base leading-tight">{cert.title}</p>
            <p className="text-white/70 text-xs mt-0.5 capitalize">{cert.category}</p>
          </div>
          {earned && (
            <div className="bg-white/20 rounded-xl px-2.5 py-1">
              <p className="text-white text-xs font-800">+{cert.xpReward} XP</p>
            </div>
          )}
        </div>
        {/* Bottom */}
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <p className="text-slate-500 text-xs font-600 leading-snug flex-1 pr-2">
            {earned ? cert.description : UNLOCK_HINTS[cert.id] || 'Keep learning to unlock!'}
          </p>
          {earned
            ? <span className="text-[10px] font-800 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full shrink-0">✅ Earned</span>
            : <ChevronRight size={14} className="text-slate-300 shrink-0" />
          }
        </div>
      </div>
    </button>
  );
}

export default function CertificatesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState({});
  const [tab, setTab] = useState('earned'); // earned | locked
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      try {
        const p1 = JSON.parse(localStorage.getItem(`ss_progress_${user.uid}`) || '{}');
        const p2 = JSON.parse(localStorage.getItem(`gv_progress_${user.uid}`) || '{}');
        setProgress({ ...p2, ...p1, xp: user.xp || p1.xp || 0, streak: user.streak || p1.streak || 0 });
      } catch {}
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const earned = getEarnedCertificates(progress);
  const earnedIds = new Set(earned.map(c => c.id));
  const locked = ALL_CERTIFICATES.filter(c => !earnedIds.has(c.id));
  const displayed = tab === 'earned' ? earned : locked;

  return (
    <AppShell title="My Certificates" back onBack={() => router.push('/profile')}>
      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Hero banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '18px 18px' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-600">{user.name?.split(' ')[0] || 'Student'}'s Achievements</p>
              <p className="text-white font-display font-900 text-3xl">{earned.length}
                <span className="text-lg font-700 text-white/70"> / {ALL_CERTIFICATES.length}</span>
              </p>
              <p className="text-white/70 text-xs mt-0.5">Certificates Earned</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="relative mt-4 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${Math.round((earned.length / ALL_CERTIFICATES.length) * 100)}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-2xl p-1 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {[
            { key: 'earned', label: `✅ Earned (${earned.length})` },
            { key: 'locked', label: `🔒 Locked (${locked.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-700 transition-all ${
                tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {displayed.length === 0 && tab === 'earned' && (
          <div className="text-center py-12 animate-fade-up">
            <div className="text-6xl mb-4">🎓</div>
            <p className="font-display font-800 text-slate-700 text-lg">No Certificates Yet</p>
            <p className="text-slate-400 text-sm mt-1">Complete lessons & quizzes to earn your first certificate!</p>
            <button onClick={() => router.push('/learn')}
              className="mt-5 bg-brand-700 text-white font-700 px-6 py-3 rounded-2xl active:scale-95 transition-all">
              Start Learning →
            </button>
          </div>
        )}

        {/* Certificate list */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {displayed.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              earned={earnedIds.has(cert.id)}
              onClick={() => earnedIds.has(cert.id) ? router.push(`/certificate/${cert.id}`) : setSelected(cert)}
            />
          ))}
        </div>

        {/* Locked hint bottom sheet */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-t-3xl w-full max-w-md p-6 animate-fade-up" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-4xl mb-4 shadow-lg grayscale`}>
                  🔒
                </div>
                <h3 className="font-display font-900 text-xl text-slate-900 mb-1">{selected.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{selected.description}</p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-full text-left mb-4">
                  <p className="text-amber-700 font-700 text-xs mb-1">🎯 How to unlock:</p>
                  <p className="text-amber-600 text-sm font-600">{UNLOCK_HINTS[selected.id]}</p>
                </div>
                <button onClick={() => { setSelected(null); router.push('/learn'); }}
                  className="w-full bg-brand-700 text-white font-800 py-3.5 rounded-2xl active:scale-95 transition-all">
                  Start Learning to Unlock →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
