import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { useNotificationStore } from '../../../store/notificationStore';
import NotificationItem from './NotificationItem';
import type { Notification } from '../types/notification';

export default function NotificationList() {
  const { isOpen, setIsOpen, notifications, markAllAsRead, dismissNotification } =
    useNotificationStore();

  const navigate = useNavigate();

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

  const handleAction = (n: Notification) => {
    setIsOpen(false);

    if (n.type === 'danger') {
      navigate('/documents');
    } else if (n.type === 'warning') {
      navigate('/budgets');
    } else if (n.metadata?.actionUrl) {
      navigate(n.metadata.actionUrl);
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
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col h-full border-l border-slate-100 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
          </div>

          <div className="flex items-center gap-3">
            {notifications.some((n) => !n.read) && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close notifications panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 shrink-0" />

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={dismissNotification}
                onAction={handleAction}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                You have no active notifications at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
