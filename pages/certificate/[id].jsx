// pages/certificate/[id].jsx — Beautiful Printable Certificate
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { CERTIFICATE_TYPES } from '../../services/certificateData';
import { ArrowLeft, Download, Share2, Star, Award } from 'lucide-react';

function formatDate(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Decorative border SVG pattern
function BorderPattern({ color }) {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={color} opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
      {/* Outer border */}
      <rect x="8" y="8" width="calc(100% - 16px)" height="calc(100% - 16px)"
        fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3"
        rx="12" />
      {/* Inner border */}
      <rect x="16" y="16" width="calc(100% - 32px)" height="calc(100% - 32px)"
        fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.2"
        rx="8" />
      {/* Corner ornaments */}
      {[[24,24],[24,'calc(100%-24)'],[' calc(100%-24)',24],['calc(100%-24)','calc(100%-24)']].map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill={color} opacity="0.2" />
          <circle cx={cx} cy={cy} r="3" fill={color} opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

export default function CertificatePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [cert, setCert] = useState(null);
  const [earnedDate, setEarnedDate] = useState(null);
  const certRef = useRef();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!id) return;
    const c = CERTIFICATE_TYPES[id];
    if (!c) { router.replace('/certificates'); return; }
    setCert(c);
    // Load earned date from localStorage
    try {
      const key = `gv_cert_${id}_${user?.uid}`;
      const saved = localStorage.getItem(key);
      if (saved) setEarnedDate(parseInt(saved));
      else {
        // First view — save the date
        const now = Date.now();
        localStorage.setItem(key, String(now));
        setEarnedDate(now);
      }
    } catch { setEarnedDate(Date.now()); }
  }, [id, user]);

  const handleShare = async () => {
    const text = `🎓 I earned the "${cert?.title}" certificate on GraamVidya!\n\n📚 Learning makes us stronger. Join me: graamvidya.app\n\n#GraamVidya #Education #RuralIndia`;
    if (navigator.share) {
      try { await navigator.share({ title: cert?.title, text }); } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      alert('Certificate text copied! Share it anywhere.');
    }
  };

  const handleDownload = () => {
    // Print-to-PDF method (works on mobile too)
    window.print();
  };

  if (loading || !user || !cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user.name?.split(' ')[0] || 'Student';
  const certColor = cert.accentColor || '#3b6cf7';

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .cert-wrapper { box-shadow: none !important; }
        }
        @keyframes shimmer-cert {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .cert-star { animation: shimmer-cert 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col max-w-md mx-auto relative">

        {/* Top bar */}
        <div className="no-print flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-700 text-slate-600">
            <ArrowLeft size={18} /> Back
          </button>
          <p className="font-display font-800 text-slate-800 text-sm">Your Certificate</p>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6 space-y-5 overflow-y-auto pb-28">

          {/* ─── THE CERTIFICATE ─────────────────────────── */}
          <div ref={certRef}
            className="cert-wrapper relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-fade-up">

            {/* Gradient header stripe */}
            <div className={`bg-gradient-to-r ${cert.color} px-6 pt-8 pb-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              {/* Stars decoration */}
              <div className="absolute top-3 left-4 cert-star text-yellow-300 text-lg">✦</div>
              <div className="absolute top-5 right-6 cert-star text-yellow-200 text-sm" style={{ animationDelay: '0.5s' }}>✦</div>
              <div className="absolute bottom-3 left-10 cert-star text-white/40 text-xs" style={{ animationDelay: '1s' }}>✦</div>

              <div className="relative text-center">
                {/* Logo */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 mb-4">
                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
                    <span className="text-[10px] font-900 text-brand-700">GV</span>
                  </div>
                  <span className="text-white text-xs font-700">GraamVidya</span>
                </div>

                {/* "Certificate of Achievement" */}
                <p className="text-white/80 text-xs font-700 uppercase tracking-[0.2em] mb-1">Certificate of Achievement</p>
                <p className="text-white/60 text-[10px] uppercase tracking-widest">प्रमाणपत्र</p>
              </div>
            </div>

            {/* Main certificate body */}
            <div className="relative px-6 py-6 bg-white">
              {/* Subtle dot pattern background */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

              <div className="relative text-center space-y-4">
                {/* Big emoji medal */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${certColor}22, ${certColor}44)`, border: `3px solid ${certColor}44` }}>
                    {cert.emoji}
                  </div>
                  {/* Ring */}
                  <div className="absolute inset-0 rounded-full"
                    style={{ border: `2px dashed ${certColor}30` }} />
                </div>

                {/* "This is to certify that" */}
                <div>
                  <p className="text-slate-400 text-xs font-600 uppercase tracking-wider">This is to certify that</p>
                  <p className="font-display font-900 text-3xl mt-1 pb-1 border-b-2 border-dashed inline-block px-4"
                    style={{ color: certColor, borderColor: `${certColor}40` }}>
                    {user.name || 'Student'}
                  </p>
                </div>

                {/* "has successfully completed" */}
                <div>
                  <p className="text-slate-400 text-xs font-600">has successfully completed</p>
                  <h2 className="font-display font-900 text-2xl text-slate-800 mt-1 leading-tight">{cert.title}</h2>
                  {cert.titleMr && (
                    <p className="text-slate-400 text-sm mt-0.5 font-600">{cert.titleMr}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm font-600 leading-relaxed">
                  {cert.description}
                </p>

                {/* Star rating decoration */}
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400 cert-star"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>

                {/* Meta info row */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { label: 'Student', value: firstName },
                    { label: 'Class', value: `Class ${user.class || '?'}` },
                    { label: 'XP Earned', value: `+${cert.xpReward} XP` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl py-2.5 px-1 text-center"
                      style={{ background: `${certColor}0d`, border: `1px solid ${certColor}20` }}>
                      <p className="text-[10px] text-slate-400 font-600 uppercase tracking-wide">{label}</p>
                      <p className="font-display font-800 text-sm mt-0.5" style={{ color: certColor }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Date + ID */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-600">
                  <span>📅 {formatDate(earnedDate)}</span>
                  <span>📍 {user.village || 'India'}</span>
                  <span>ID: GV-{(user.uid || 'XXX').slice(-6).toUpperCase()}</span>
                </div>

                {/* Signature line */}
                <div className="flex items-end justify-between pt-2">
                  <div className="text-center">
                    <div className="w-24 h-px bg-slate-300 mb-1" />
                    <p className="text-[10px] text-slate-400 font-600">Student Signature</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${certColor}15`, border: `2px solid ${certColor}30` }}>
                    <Award size={22} style={{ color: certColor }} />
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-px bg-slate-300 mb-1" />
                    <p className="text-[10px] text-slate-400 font-600">GraamVidya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ─── END CERTIFICATE ─────────────────────────── */}

          {/* Action buttons */}
          <div className="no-print grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <button onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-white border-2 border-brand-200 text-brand-700 font-700 py-3.5 rounded-2xl active:scale-95 transition-all shadow-sm">
              <Share2 size={18} /> Share
            </button>
            <button onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-brand-700 text-white font-700 py-3.5 rounded-2xl active:scale-95 transition-all shadow-glow">
              <Download size={18} /> Save / Print
            </button>
          </div>

          {/* Earn more */}
          <div className="no-print bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <div className="text-3xl">🎯</div>
            <div className="flex-1">
              <p className="text-white font-display font-800 text-sm">Earn More Certificates!</p>
              <p className="text-slate-400 text-xs mt-0.5">Keep learning to unlock all achievements</p>
            </div>
            <button onClick={() => router.push('/certificates')}
              className="bg-brand-600 text-white text-xs font-700 px-3 py-2 rounded-xl shrink-0">
              View All
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
