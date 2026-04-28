// pages/community.jsx — GraamVidya Peer Learning + Saturday Contest
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Users, MessageCircle, Trophy, Zap, Heart, Send, Clock, Star, Flame, ChevronRight } from 'lucide-react';

const PEER_GROUPS = [
  { id: 'math10', name: 'Class 10 Math Warriors', members: 48, active: 12, emoji: '🧮', subject: 'Mathematics', lastMsg: '5 min ago' },
  { id: 'sci9',   name: 'Science Stars (Class 9)', members: 35, active: 8,  emoji: '🔬', subject: 'Science',     lastMsg: '12 min ago' },
  { id: 'eng',    name: 'English Speakers Club',   members: 62, active: 19, emoji: '🗣️', subject: 'English',     lastMsg: '2 min ago' },
  { id: 'board',  name: 'Board Exam Prep 2025',    members: 94, active: 31, emoji: '📝', subject: 'All Subjects', lastMsg: 'Just now' },
  { id: 'govt',   name: 'Govt Job Aspirants',      members: 27, active: 5,  emoji: '🏛️', subject: 'GK & Current', lastMsg: '1 hr ago' },
];

const SAMPLE_POSTS = [
  { id: 1, author: 'Priya S.', village: 'Wardha', emoji: '🧮', text: 'Can anyone explain Pythagoras theorem in simple words? I keep getting confused 😕', likes: 12, replies: 8, time: '10m ago', subject: 'Math' },
  { id: 2, author: 'Rahul D.', village: 'Solapur', emoji: '🔬', text: 'I got 95% in Science by doing Smart Revision every day for 2 weeks! 🎉 You all can do it too!', likes: 34, replies: 15, time: '25m ago', subject: 'Science' },
  { id: 3, author: 'Anjali K.', village: 'Nashik', emoji: '🎓', text: 'Found a new scholarship for rural students from Maharashtra! Deadline is June 30. Check the Opportunities section!', likes: 56, replies: 22, time: '1h ago', subject: 'Scholarship' },
];

const CONTEST_INFO = {
  title: 'Weekly Saturday Contest',
  desc: '30-minute quiz challenge — all subjects, all classes. Top 3 win special badges!',
  prizes: ['👑 Gold Badge + 500 XP', '🥈 Silver Badge + 250 XP', '🥉 Bronze Badge + 100 XP'],
  nextDate: (() => {
    const d = new Date();
    const diff = (6 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toDateString();
  })(),
};

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('feed'); // feed | groups | contest
  const [liked, setLiked] = useState({});
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const isSaturday = new Date().getDay() === 6;

  return (
    <AppShell title="Community">
      <div className="pb-2">
        {/* Tabs */}
        <div className="px-4 pt-4 pb-0">
          <div className="flex bg-slate-100 rounded-2xl p-1">
            {[['feed','💬 Feed'], ['groups','👥 Groups'], ['contest','🏆 Contest']].map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-2 rounded-xl text-xs font-700 transition-all ${tab === k ? 'bg-white text-brand-700 shadow-card' : 'text-slate-400'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FEED ── */}
        {tab === 'feed' && (
          <div className="px-4 pt-4 space-y-4">
            {/* Post box */}
            <div className="card p-4 animate-fade-up">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-display font-900">{(user.name || 'U')[0]}</span>
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full text-sm text-slate-700 placeholder-slate-400 resize-none bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 focus:border-brand-400 focus:bg-white transition-all"
                    rows={2}
                    placeholder="Share a doubt, tip, or achievement with your fellow learners..."
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-400 text-xs">{user.village || 'My Village'}</span>
                    <button
                      className="flex items-center gap-1.5 bg-brand-700 text-white text-xs font-700 px-3 py-1.5 rounded-xl active:scale-95 transition-all disabled:opacity-50"
                      disabled={!newPost.trim()}
                      onClick={() => setNewPost('')}
                    >
                      <Send size={12} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed posts */}
            {SAMPLE_POSTS.map((post, i) => (
              <div key={post.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-700 text-slate-800 text-sm">{post.author}</p>
                      <span className="text-[10px] bg-brand-100 text-brand-700 font-700 px-1.5 py-0.5 rounded-full">{post.subject}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] mb-2">📍 {post.village} · {post.time}</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => setLiked(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className={`flex items-center gap-1.5 text-xs font-700 transition-colors ${liked[post.id] ? 'text-rose-500' : 'text-slate-400'}`}>
                        <Heart size={14} className={liked[post.id] ? 'fill-rose-500' : ''} />
                        {post.likes + (liked[post.id] ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-700 text-slate-400">
                        <MessageCircle size={14} /> {post.replies} replies
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── GROUPS ── */}
        {tab === 'groups' && (
          <div className="px-4 pt-4 space-y-3">
            <p className="text-slate-500 text-sm animate-fade-up">Join groups by subject, class, or goal. Ask questions, share tips, grow together 🌱</p>
            {PEER_GROUPS.map((g, i) => (
              <button key={g.id} className="w-full animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="card p-4 flex items-center gap-4 active:scale-[.98] transition-all hover:border-brand-200 border-2 border-transparent">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                    {g.emoji}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-display font-800 text-slate-800 text-sm">{g.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{g.subject} · {g.members} members</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-700 text-xp-600 bg-xp-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-xp-500 rounded-full animate-pulse" /> {g.active} active
                      </span>
                      <span className="text-[10px] text-slate-400">{g.lastMsg}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── CONTEST ── */}
        {tab === 'contest' && (
          <div className="px-4 pt-4 space-y-4">
            {/* Contest hero */}
            <div className={`rounded-3xl p-5 relative overflow-hidden animate-fade-up ${isSaturday ? 'bg-gradient-to-br from-saffron-500 to-rose-500' : 'bg-gradient-to-br from-brand-700 to-indigo-700'}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 2px, transparent 2px)', backgroundSize: '18px 18px' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Trophy size={30} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-display font-900 text-xl">{CONTEST_INFO.title}</p>
                    <p className="text-white/70 text-xs mt-0.5">Every Saturday · 30 minutes</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{CONTEST_INFO.desc}</p>
                {isSaturday ? (
                  <button className="w-full bg-white text-brand-700 font-display font-800 py-3 rounded-2xl active:scale-95 transition-all text-base">
                    🎉 Contest is LIVE — Join Now!
                  </button>
                ) : (
                  <div className="bg-white/20 rounded-2xl px-4 py-3">
                    <p className="text-white text-sm font-600">Next Contest: <span className="font-800">{CONTEST_INFO.nextDate}</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Prize breakdown */}
            <div className="card animate-fade-up" style={{ animationDelay: '80ms' }}>
              <h3 className="font-display font-800 text-slate-800 mb-3 flex items-center gap-2">
                <Star size={16} className="text-amber-500" /> Prize Pool
              </h3>
              <div className="space-y-3">
                {CONTEST_INFO.prizes.map((p, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl ${i === 0 ? 'bg-amber-50' : i === 1 ? 'bg-slate-50' : 'bg-orange-50'}`}>
                    <span className="text-2xl">#{i + 1}</span>
                    <p className={`font-700 text-sm ${i === 0 ? 'text-amber-700' : i === 1 ? 'text-slate-600' : 'text-orange-700'}`}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="card animate-fade-up" style={{ animationDelay: '140ms' }}>
              <h3 className="font-display font-800 text-slate-800 mb-3">How it works</h3>
              <div className="space-y-2.5">
                {[
                  ['🕰️', 'Every Saturday, 10 AM – 10:30 AM'],
                  ['📝', '20 questions from all subjects'],
                  ['⚡', 'Faster answers = more bonus XP'],
                  ['🏆', 'Top 3 get special badges + XP'],
                  ['🌍', 'Village rank updates every Saturday'],
                ].map(([emoji, text]) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-xl">{emoji}</span>
                    <p className="text-sm text-slate-600 font-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Past winners */}
            <div className="card animate-fade-up" style={{ animationDelay: '180ms' }}>
              <h3 className="font-display font-800 text-slate-800 mb-3">🏅 Last Week's Winners</h3>
              {['Arjun Patil — Wardha (850 pts)','Priya Shinde — Nashik (780 pts)','Rohan Kale — Solapur (710 pts)'].map((w, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xl">{['👑','🥈','🥉'][i]}</span>
                  <p className="text-sm font-600 text-slate-700">{w}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
