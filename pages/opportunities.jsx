// pages/opportunities.jsx — GraamVidya: Scholarships, Olympiads, Internships
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import AppShell from '../components/layout/AppShell';
import Spinner from '../components/ui/Spinner';
import { Bell, MapPin, Calendar, ExternalLink, Filter, Search, ChevronRight, Star, Zap } from 'lucide-react';

const OPPORTUNITIES = [
  // Scholarships
  { id: 's1', type: 'scholarship', emoji: '🎓', title: 'NSP Pre-Matric Scholarship', org: 'Govt. of India', amount: '₹2,500/year', deadline: 'Oct 31, 2025', state: 'All India', class: ['5','6','7','8','9','10'], tags: ['SC/ST/OBC','Free'], link: '#', hot: true },
  { id: 's2', type: 'scholarship', emoji: '🏅', title: 'Maharashtra Govt Talent Search', org: 'Maharashtra Govt', amount: '₹6,000/year', deadline: 'Sep 15, 2025', state: 'Maharashtra', class: ['8','9','10'], tags: ['Merit-based'], link: '#', hot: true },
  { id: 's3', type: 'scholarship', emoji: '📚', title: 'Inspire Award Manak', org: 'DST India', amount: '₹10,000', deadline: 'Nov 30, 2025', state: 'All India', class: ['6','7','8'], tags: ['Science','Innovation'], link: '#', hot: false },
  { id: 's4', type: 'scholarship', emoji: '🌟', title: 'PM Yasasvi Scholarship', org: 'NTA India', amount: '₹75,000–1.25L/year', deadline: 'Aug 10, 2025', state: 'All India', class: ['9','10','11','12'], tags: ['OBC/EBC/DNT'], link: '#', hot: true },
  // Olympiads
  { id: 'o1', type: 'olympiad', emoji: '🧮', title: 'IMO — Maths Olympiad', org: 'Science Olympiad Foundation', amount: 'Cash prizes + medals', deadline: 'Aug 20, 2025', state: 'All India', class: ['1','2','3','4','5','6','7','8','9','10','11','12'], tags: ['Maths','Competitive'], link: '#', hot: true },
  { id: 'o2', type: 'olympiad', emoji: '🔬', title: 'NSO — Science Olympiad', org: 'Science Olympiad Foundation', amount: 'Medals + scholarships', deadline: 'Aug 20, 2025', state: 'All India', class: ['1','2','3','4','5','6','7','8','9','10','11','12'], tags: ['Science'], link: '#', hot: false },
  { id: 'o3', type: 'olympiad', emoji: '🗣️', title: 'IEO — English Olympiad', org: 'Science Olympiad Foundation', amount: 'Medals + prizes', deadline: 'Aug 20, 2025', state: 'All India', class: ['1','2','3','4','5','6','7','8','9','10','11','12'], tags: ['English'], link: '#', hot: false },
  { id: 'o4', type: 'olympiad', emoji: '💡', title: 'NTSE — National Talent Search', org: 'NCERT', amount: '₹1,250/month scholarship', deadline: 'Sep 30, 2025', state: 'All India', class: ['10'], tags: ['Prestigious','Scholarship'], link: '#', hot: true },
  // Internships
  { id: 'i1', type: 'internship', emoji: '💼', title: 'Google AI Explore Program', org: 'Google India', amount: 'Free + certificate', deadline: 'Sep 1, 2025', state: 'Online', class: ['9','10','11','12'], tags: ['Tech','AI','Online'], link: '#', hot: true },
  { id: 'i2', type: 'internship', emoji: '🌿', title: 'Rural Innovation Internship', org: 'Agri Ministry India', amount: '₹5,000/month', deadline: 'Oct 5, 2025', state: 'Maharashtra', class: ['11','12'], tags: ['Rural','Agriculture'], link: '#', hot: false },
  { id: 'i3', type: 'internship', emoji: '🏥', title: 'Health Awareness Camp Volunteer', org: 'State Health Dept', amount: 'Certificate + experience', deadline: 'Ongoing', state: 'Maharashtra', class: ['9','10','11','12'], tags: ['Health','Volunteer'], link: '#', hot: false },
];

const TYPES = ['all', 'scholarship', 'olympiad', 'internship'];
const TYPE_LABELS = { all: '🔍 All', scholarship: '🎓 Scholarships', olympiad: '🥇 Olympiads', internship: '💼 Internships' };
const TYPE_COLORS = { scholarship: 'bg-brand-100 text-brand-700', olympiad: 'bg-amber-100 text-amber-700', internship: 'bg-sky-100 text-sky-700' };

export default function OpportunitiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [userClass, setUserClass] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user?.class) setUserClass(user.class);
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const filtered = OPPORTUNITIES.filter(o => {
    if (activeType !== 'all' && o.type !== activeType) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.org.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const hot = filtered.filter(o => o.hot);
  const rest = filtered.filter(o => !o.hot);

  const cardAccent = (type) => type === 'scholarship' ? 'border-brand-200' : type === 'olympiad' ? 'border-amber-200' : 'border-sky-200';

  return (
    <AppShell title="Opportunities" back onBack={() => router.push('/home')}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Hero */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-brand-700 to-indigo-700 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, white 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-display font-900 text-xl">Opportunities</p>
              <p className="text-white/70 text-sm mt-0.5">Scholarships · Olympiads · Internships</p>
              <p className="text-white/50 text-xs mt-1">{OPPORTUNITIES.length} opportunities found for you</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-up" style={{ animationDelay: '50ms' }}>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10 text-sm" placeholder="Search scholarships, olympiads..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-700 transition-all border ${
                activeType === t ? 'bg-brand-700 text-white border-brand-700 shadow-glow' : 'bg-white text-slate-600 border-slate-200'
              }`}>
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Location + class note */}
        {userClass && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <MapPin size={13} className="text-brand-500" />
            Showing for: <span className="font-700 text-brand-600">Class {userClass} · {user.village || 'Your Area'}</span>
          </div>
        )}

        {/* HOT opportunities */}
        {hot.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <h3 className="font-display font-800 text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Zap size={16} className="text-saffron-500" /> Hot Right Now
            </h3>
            <div className="space-y-3">
              {hot.map((o, i) => (
                <div key={o.id} className={`card p-4 border-2 ${cardAccent(o.type)} animate-fade-up`} style={{ animationDelay: `${130 + i * 40}ms` }}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{o.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display font-800 text-slate-800 text-sm leading-snug">{o.title}</p>
                        <span className={`shrink-0 text-[10px] font-700 px-2 py-0.5 rounded-full ${TYPE_COLORS[o.type]}`}>
                          {TYPE_LABELS[o.type].split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">{o.org}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {o.tags.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-500 text-[10px] font-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-brand-600 font-700 text-sm">{o.amount}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Calendar size={10} /> Deadline: {o.deadline}
                          </div>
                        </div>
                        <button className="flex items-center gap-1 bg-brand-700 text-white text-xs font-700 px-3 py-1.5 rounded-xl active:scale-95 transition-all">
                          Apply <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More opportunities */}
        {rest.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '280ms' }}>
            <h3 className="font-display font-800 text-slate-800 text-sm mb-3">More Opportunities</h3>
            <div className="space-y-3">
              {rest.map((o, i) => (
                <div key={o.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${290 + i * 30}ms` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{o.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-800 text-slate-800 text-sm truncate">{o.title}</p>
                      <p className="text-slate-400 text-xs">{o.org} · <span className="text-brand-600 font-700">{o.amount}</span></p>
                      <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1"><Calendar size={9} /> {o.deadline}</p>
                    </div>
                    <button className="shrink-0 p-2 bg-slate-100 rounded-xl active:scale-95 transition-all">
                      <ChevronRight size={16} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">🔍</p>
            <p className="text-slate-500 font-600">No results found.</p>
            <p className="text-slate-400 text-sm">Try clearing the search filter.</p>
          </div>
        )}

        {/* AI Prep Guide CTA */}
        <div className="card bg-gradient-to-r from-brand-700 to-indigo-700 text-white animate-fade-up" style={{ animationDelay: '360ms' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-800">AI Preparation Guide</p>
              <p className="text-white/70 text-xs">Let AI create your competition prep plan</p>
            </div>
          </div>
          <button onClick={() => router.push('/chat')}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-700 py-2.5 rounded-xl text-sm transition-all active:scale-95">
            Get My AI Study Plan →
          </button>
        </div>

      </div>
    </AppShell>
  );
}
