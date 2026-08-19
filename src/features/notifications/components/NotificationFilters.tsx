import type { NotificationFilter, NotificationType } from '../types/notification';

interface FilterPill {
  label: string;
  patch: Partial<NotificationFilter>;
}

const PILLS: FilterPill[] = [
  { label: 'All', patch: { isRead: undefined, type: undefined } },
  { label: 'Unread', patch: { isRead: false, type: undefined } },
  { label: 'Documents', patch: { type: 'DOCUMENT', isRead: undefined } },
  { label: 'Bills', patch: { type: 'BILL', isRead: undefined } },
  { label: 'Budgets', patch: { type: 'BUDGET', isRead: undefined } },
  { label: 'Goals', patch: { type: 'GOAL', isRead: undefined } },
  { label: 'Security', patch: { type: 'SECURITY', isRead: undefined } },
];

interface NotificationFiltersProps {
  filter: NotificationFilter;
  onApply: (patch: Partial<NotificationFilter>) => void;
}

function isActive(filter: NotificationFilter, pill: FilterPill): boolean {
  const { isRead, type } = pill.patch;
  const typeMatch = type === undefined ? filter.type === undefined : filter.type === type;
  const readMatch = isRead === undefined ? filter.isRead === undefined : filter.isRead === isRead;
  return typeMatch && readMatch;
}

export default function NotificationFilters({ filter, onApply }: NotificationFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto scrollbar-none shrink-0">
      {PILLS.map((pill) => {
        const active = isActive(filter, pill);
        return (
          <button
            key={pill.label}
            type="button"
            onClick={() => onApply(pill.patch as Partial<NotificationFilter>)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}

export type { NotificationType };
