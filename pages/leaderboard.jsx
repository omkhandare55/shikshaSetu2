// pages/leaderboard.jsx — GraamVidya Village Leaderboard
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Trophy, Flame, Star, Crown, TrendingUp, Users, MapPin } from 'lucide-react';

// Generate mock village leaderboard data
function generateLeaderboard(user) {
  const names = [
    'Arjun Patil','Priya Shinde','Rahul Desai','Sneha Kulkarni','Vikram More',
    'Anjali Jadhav','Suresh Gaikwad','Pooja Pawar','Amit Sonawane','Kavita Bhosale',
    'Rohan Kale','Meena Deshpande','Sanjay Wade','Nita Bane','Ganesh Sardar',
  ];
  const villages = ['Ahmednagar','Wardha','Nandurbar','Solapur','Pune Rural','Osmanabad'];

  const board = names.map((name, i) => ({
    id: `mock_${i}`,
    name,
    village: villages[Math.floor(Math.random() * villages.length)],
    xp: Math.floor(Math.random() * 2000) + 200,
    streak: Math.floor(Math.random() * 30),
    level: Math.floor(Math.random() * 5) + 1,
    badge: i < 3 ? ['👑','🥈','🥉'][i] : '⭐',
  })).sort((a, b) => b.xp - a.xp);

  // Inject real user
  if (user) {
    const userEntry = {
      id: user.uid,
      name: user.name || 'You',
      village: user.village || 'My Village',
      xp: user.xp || 0,
      streak: user.streak || 0,
      level: 1,
      badge: '⭐',
      isMe: true,
    };
    board.push(userEntry);
    board.sort((a, b) => b.xp - a.xp);
  }
  return board.map((e, i) => ({ ...e, rank: i + 1 }));
}

const TABS = ['Village', 'Class', 'National'];

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('Village');
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) setBoard(generateLeaderboard(user));
  }, [user]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const myEntry = board.find(e => e.isMe);
  const myRank = myEntry?.rank || '—';
  const top3 = board.slice(0, 3);
  const rest = board.slice(3, 20);

  const rankColor = (r) => r === 1 ? 'text-amber-500' : r === 2 ? 'text-slate-400' : r === 3 ? 'text-amber-700' : 'text-slate-500';
  const rankBg   = (r) => r === 1 ? 'bg-amber-50 border-amber-200' : r === 2 ? 'bg-slate-50 border-slate-200' : r === 3 ? 'bg-amber-50/60 border-amber-100' : 'bg-white border-slate-100';

  return (
    <AppShell title="Leaderboard" back onBack={() => router.push('/home')}>
      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Hero banner */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-400 via-saffron-500 to-rose-500 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-600 mb-1">Your Village Rank</p>
              <p className="font-display font-900 text-white text-5xl">#{myRank}</p>
              <p className="text-white/70 text-xs mt-1">{user.village || 'My Village'} · {board.length} learners</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy size={34} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-2xl p-1 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-700 transition-all ${tab === t ? 'bg-white text-brand-700 shadow-card' : 'text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h3 className="font-display font-800 text-slate-700 text-sm mb-3 flex items-center gap-2">
            <Crown size={16} className="text-amber-500" /> Top Learners
          </h3>
          <div className="flex items-end gap-3">
            {/* 2nd */}
            {top3[1] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center shadow-md mb-2">
                  <span className="font-display font-900 text-white text-xl">{top3[1].name[0]}</span>
                </div>
                <p className="font-700 text-slate-700 text-xs text-center truncate w-full px-1">{top3[1].name}</p>
                <p className="text-slate-400 text-[10px]">{top3[1].xp} XP</p>
                <div className="w-full bg-slate-200 rounded-t-xl h-16 mt-2 flex items-center justify-center">
                  <span className="text-2xl">🥈</span>
                </div>
              </div>
            )}
            {/* 1st */}
            {top3[0] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-2 animate-bounce-sm">
                  <span className="font-display font-900 text-white text-2xl">{top3[0].name[0]}</span>
                </div>
                <p className="font-800 text-slate-800 text-sm text-center truncate w-full px-1">{top3[0].name}</p>
                <p className="text-amber-600 text-xs font-700">{top3[0].xp} XP</p>
                <div className="w-full bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-xl h-24 mt-2 flex items-center justify-center">
                  <span className="text-3xl">👑</span>
                </div>
              </div>
            )}
            {/* 3rd */}
            {top3[2] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-md mb-2">
                  <span className="font-display font-900 text-white text-xl">{top3[2].name[0]}</span>
                </div>
                <p className="font-700 text-slate-700 text-xs text-center truncate w-full px-1">{top3[2].name}</p>
                <p className="text-slate-400 text-[10px]">{top3[2].xp} XP</p>
                <div className="w-full bg-amber-100 rounded-t-xl h-12 mt-2 flex items-center justify-center">
                  <span className="text-2xl">🥉</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="space-y-2 animate-fade-up" style={{ animationDelay: '180ms' }}>
          {rest.map((entry, i) => (
            <div key={entry.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${entry.isMe ? 'bg-brand-50 border-brand-300 shadow-glow' : `${rankBg(entry.rank)} border`}`}>
              <span className={`font-display font-900 text-base w-6 text-center ${rankColor(entry.rank)}`}>
                {entry.rank}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-900 text-base
                ${entry.isMe ? 'bg-gradient-to-br from-brand-600 to-brand-800' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                {entry.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-700 text-sm truncate ${entry.isMe ? 'text-brand-700' : 'text-slate-700'}`}>
                  {entry.name} {entry.isMe && '(You)'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <MapPin size={9} /> {entry.village}
                  </span>
                  <span className="text-[10px] text-saffron-500 flex items-center gap-0.5 font-600">
                    <Flame size={9} /> {entry.streak}d
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-display font-800 text-sm ${entry.isMe ? 'text-brand-600' : 'text-slate-600'}`}>{entry.xp} XP</p>
                <p className="text-slate-400 text-[10px]">Lv.{entry.level}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly contest promo */}
        <div className="animate-fade-up card bg-gradient-to-r from-brand-700 to-indigo-700 text-white" style={{ animationDelay: '260ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800 text-base">Saturday Contest</p>
              <p className="text-white/70 text-xs mt-0.5">30-min quiz · Top 3 win special badges!</p>
            </div>
          </div>
          <button onClick={() => router.push('/community')}
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-700 py-3 rounded-xl transition-all active:scale-95 text-sm">
            View Upcoming Contest →
          </button>
        </div>

      </div>
    </AppShell>
  );
}
