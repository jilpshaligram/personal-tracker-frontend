import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  Shield,
  TrendingUp,
  DollarSign,
  Bell,
  Target,
  X,
  PiggyBank,
} from 'lucide-react';
import type { Notification, NotificationType } from '../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

function getIcon(type: NotificationType) {
  const cls = 'w-5 h-5 shrink-0';
  switch (type) {
    case 'DOCUMENT':
      return <FileText className={`${cls} text-blue-600`} />;
    case 'BILL':
      return <AlertCircle className={`${cls} text-amber-600`} />;
    case 'BUDGET':
      return <TrendingUp className={`${cls} text-orange-600`} />;
    case 'GOAL':
      return <Target className={`${cls} text-purple-600`} />;
    case 'SAVING':
      return <PiggyBank className={`${cls} text-emerald-600`} />;
    case 'EXPENSE':
      return <DollarSign className={`${cls} text-red-600`} />;
    case 'INCOME':
      return <CheckCircle className={`${cls} text-emerald-600`} />;
    case 'SECURITY':
      return <Shield className={`${cls} text-red-600`} />;
    case 'REMINDER':
      return <Bell className={`${cls} text-blue-500`} />;
    case 'SYSTEM':
      return <AlertTriangle className={`${cls} text-slate-500`} />;
    default:
      return <Bell className={`${cls} text-slate-500`} />;
  }
}

function getPriorityBorder(priority: Notification['priority'], isRead: boolean): string {
  if (isRead) return 'border-slate-100';
  switch (priority) {
    case 'CRITICAL':
      return 'border-l-4 border-l-red-500 border-slate-100';
    case 'HIGH':
      return 'border-l-4 border-l-amber-500 border-slate-100';
    case 'MEDIUM':
      return 'border-l-4 border-l-blue-400 border-slate-100';
    default:
      return 'border-slate-100';
  }
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NotificationItem({
  notification,
  onDismiss,
  onMarkAsRead,
}: NotificationItemProps) {
  const { id, title, message, type, priority, isRead, createdAt } = notification;

  const handleClick = () => {
    if (!isRead) onMarkAsRead(id);
  };

  return (
    <div
      className={`relative group p-4 rounded-xl border bg-white transition-all hover:shadow-sm ${getPriorityBorder(priority, isRead)} ${
        !isRead ? 'bg-blue-50/30' : ''
      }`}
      onClick={handleClick}
      style={{ cursor: !isRead ? 'pointer' : 'default' }}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">{getIcon(type)}</div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`text-sm font-semibold truncate ${
                isRead ? 'text-slate-600' : 'text-slate-800'
              }`}
            >
              {title}
            </h4>
            <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
              {formatTime(createdAt)}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">{message}</p>

          {!isRead && (priority === 'HIGH' || priority === 'CRITICAL') && (
            <span
              className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {priority}
            </span>
          )}
        </div>

        {!isRead && (
          <span className="absolute top-4 right-8 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(id);
          }}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
