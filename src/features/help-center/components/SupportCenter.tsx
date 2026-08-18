import { useEffect, useState } from 'react';
import { Mail, X, Send, CheckCircle } from 'lucide-react';
import { useHelpStore } from '../../../store/helpStore';
import { useAuth } from '../../../context';
import { apiClient } from '../../../api/client';

export default function SupportCenter() {
  const { isOpen, setIsOpen } = useHelpStore();
  const { user } = useAuth();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isOpen) {
      Promise.resolve().then(() => {
        setSubject('');
        setMessage('');
        setIsSuccess(false);
        setIsSubmitting(false);
        setErrorMessage(null);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiClient.post('/support/send', {
        subject,
        message,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Failed to send support message:', err);
      let msg = 'Failed to send message. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) {
          msg = res.data.message;
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Mail className="w-4.5 h-4.5" />
            </span>
            <h2 className="text-base font-semibold text-slate-800">Help Center</h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close help center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Have a question or running into an issue? Drop us a line and our support team will
                  get back to you shortly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Your Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed select-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about budgets"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all text-slate-700 placeholder-slate-400 resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs leading-relaxed">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          ) : (
            /* Success confirmation screen */
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle className="w-7 h-7" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-800">Message Sent!</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-[240px] leading-relaxed">
                  Thank you! Your request was sent. Our team will contact you at{' '}
                  <strong className="text-slate-700">{user?.email}</strong> shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-4 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
