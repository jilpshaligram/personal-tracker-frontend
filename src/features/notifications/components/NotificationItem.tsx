import { AlertTriangle, AlertCircle, CheckCircle, FileText, X } from 'lucide-react';
import type { Notification } from '../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

export default function NotificationItem({
  notification,
  onDismiss,
  onAction,
}: NotificationItemProps) {
  const { title, description, time, type, metadata } = notification;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500 shrink-0" />;
    }
  };

  const getCardStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-50/20 border-red-200';
      case 'success':
        return 'bg-white border-slate-200 border-l-4 border-l-emerald-600';
      default:
        return 'bg-white border-slate-200';
    }
  };

  return (
    <div className={`relative p-4 rounded-xl border transition-all ${getCardStyle()}`}>
      <div className="flex gap-3">
        <div className="mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{title}</h4>
            <span
              className={`text-[11px] font-medium shrink-0 ${
                type === 'danger' ? 'text-red-500' : 'text-slate-400'
              }`}
            >
              {time}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-3">{description}</p>

          {type === 'warning' && metadata?.budgetPercent && (
            <div className="mb-3.5">
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-amber-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${metadata.budgetPercent}%` }}
                />
              </div>
            </div>
          )}

          {metadata?.actionLabel && (
            <div className="flex items-center gap-3">
              {type === 'success' ? (
                <a
                  href={metadata.actionUrl ?? '#'}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  onClick={(e) => {
                    if (onAction) {
                      e.preventDefault();
                      onAction(notification);
                    }
                  }}
                >
                  {metadata.actionLabel}
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onAction?.(notification)}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      type === 'danger'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {metadata.actionLabel}
                  </button>
                  {type === 'danger' && (
                    <button
                      type="button"
                      onClick={() => onDismiss(notification.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5 transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {type !== 'danger' && (
          <button
            type="button"
            onClick={() => onDismiss(notification.id)}
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
