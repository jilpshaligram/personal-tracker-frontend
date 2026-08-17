import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../../store/notificationStore';

export default function NotificationBell() {
  const { unreadCount, setIsOpen } = useNotificationStore();

  return (
    <button
      type="button"
      id="notification-bell-btn"
      onClick={() => setIsOpen(true)}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
      aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
    </button>
  );
}
