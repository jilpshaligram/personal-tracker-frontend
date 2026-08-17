import { useEffect } from 'react';
import { Bell, X, Trash2, RefreshCw, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../../../store/notificationStore';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import NotificationFilters from './NotificationFilters';

function SkeletonItem() {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-white animate-pulse">
      <div className="flex gap-3">
        <div className="w-5 h-5 rounded-full bg-slate-200 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function NotificationList() {
  const { isOpen, setIsOpen } = useNotificationStore();

  const {
    notifications,
    total,
    isLoading,
    isActing,
    error,
    filter,
    markAsRead,
    markAllRead,
    dismiss,
    clearAll,
    applyFilter,
    reload,
  } = useNotifications();

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

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col h-full border-l border-slate-100 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Bell className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-800 leading-none">Notifications</h2>
              {total > 0 && <p className="text-[11px] text-slate-400 mt-0.5">{total} total</p>}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => reload()}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-40"
              aria-label="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {hasUnread && (
              <button
                type="button"
                onClick={markAllRead}
                disabled={isActing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-all cursor-pointer disabled:opacity-40"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                disabled={isActing}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40"
                aria-label="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close notifications panel"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <NotificationFilters filter={filter} onApply={applyFilter} />

        <div className="h-px bg-slate-100 shrink-0" />

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {error && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">{error}</p>
              <button
                type="button"
                onClick={() => reload()}
                className="mt-3 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {!error && isLoading && notifications.length === 0 && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </>
          )}

          {!error && !isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-300 mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                No notifications match your current filter.
              </p>
            </div>
          )}

          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onDismiss={dismiss}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      </div>
    </>
  );
}
