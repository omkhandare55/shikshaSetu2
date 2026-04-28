import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, BookOpen, DownloadCloud, Search, CheckCircle2, FileText, Library } from 'lucide-react';
import AppShell from '../components/layout/AppShell';

export default function NotebooksPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState(['Science - Chapter 1']);

  const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  const notebooks = [
    { id: 1, title: 'Mathematics', chapters: ['Chapter 1: Real Numbers', 'Chapter 2: Polynomials', 'Chapter 3: Quadratic Equations'], color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, title: 'Science', chapters: ['Chapter 1: Chemical Reactions', 'Chapter 2: Acids & Bases', 'Chapter 3: Metals & Non-metals'], color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 3, title: 'English', chapters: ['Grammar: Tenses', 'Literature: First Flight', 'Writing: Letter Formats'], color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const handleDownload = (notebookTitle, chapter) => {
    const key = `${notebookTitle} - ${chapter}`;
    if (downloaded.includes(key)) return;
    
    setDownloading(key);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, key]);
    }, 1500);
  };

  return (
    <AppShell>
      <div className="px-5 pt-6 pb-24 space-y-6">
        <div className="flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <h2 className="font-display font-900 text-2xl text-slate-900 leading-tight">E-Notebooks</h2>
              <p className="text-sm font-500 text-slate-500">Offline study materials</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
            <Library size={24} className="text-indigo-600" />
          </div>
        </div>

        <div className="animate-fade-up space-y-4" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search subjects or chapters..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl font-500 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="overflow-x-auto pb-2 -mx-5 px-5 hide-scrollbar">
            <div className="flex gap-2">
              {classes.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-700 transition-colors ${
                    selectedClass === c 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {notebooks.map(notebook => (
              <div key={notebook.id} className="card p-5 border-l-4" style={{ borderLeftColor: notebook.id === 1 ? '#2563eb' : notebook.id === 2 ? '#10b981' : '#9333ea' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notebook.bg}`}>
                    <BookOpen size={20} className={notebook.color} />
                  </div>
                  <h3 className="font-display font-800 text-lg text-slate-800">{notebook.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {notebook.chapters.map((chapter, idx) => {
                    const key = `${notebook.title} - ${chapter}`;
                    const isDownloaded = downloaded.includes(key);
                    const isDownloading = downloading === key;

                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText size={16} className="text-slate-400 shrink-0" />
                          <span className="text-sm font-600 text-slate-700 truncate">{chapter}</span>
                        </div>
                        
                        <button 
                          onClick={() => handleDownload(notebook.title, chapter)}
                          disabled={isDownloaded || isDownloading}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isDownloaded ? 'bg-emerald-100 text-emerald-600' : 
                            isDownloading ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 
                            'bg-white text-slate-500 hover:text-indigo-600 shadow-sm border border-slate-200'
                          }`}
                        >
                          {isDownloaded ? <CheckCircle2 size={16} /> : <DownloadCloud size={16} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
