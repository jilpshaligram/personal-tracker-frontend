import { useEffect, useState } from 'react';
import { HelpCircle, X, Search, MessageSquare, Mail, FileText } from 'lucide-react';
import { useHelpStore } from '../../../store/helpStore';

export default function SupportCenter() {
  const { isOpen, setIsOpen } = useHelpStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setIsOpen]);

  const articles = [
    {
      title: 'How to reconcile accounts',
      description: 'Step-by-step guide to monthly reconciliation.',
    },
    {
      title: 'Exporting tax documents',
      description: 'Download your year-end financial summaries.',
    },
    {
      title: 'Managing user roles',
      description: 'Set permissions for your finance team.',
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl flex flex-col h-full border-l border-slate-100 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-semibold text-slate-800">Support Center</h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close support center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-px bg-slate-100 shrink-0" />

        <div className="flex-1 overflow-y-auto p-5 bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-3">
              Quick Actions
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 hover:text-slate-800"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold">Live Chat</span>
              </button>
              <button
                type="button"
                className="flex-1 py-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 hover:text-slate-800"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold">Email Us</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-3">
              Recommended Articles
            </h3>
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, i) => (
                  <div key={i} className="flex gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {article.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No articles found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
