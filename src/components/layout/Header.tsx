import { Bell, HelpCircle, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3.5 shrink-0">
      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
        </button>

        {/* Help icon */}
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Get help"
        >
          <HelpCircle className="w-4.5 h-4.5" strokeWidth={1.75} />
        </button>

        {/* Vertical divider */}
        <div className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />

        {/* User */}
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
          aria-label="User menu"
        >
          {/* Avatar */}
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0 select-none"
            aria-hidden="true"
          >
            AR
          </span>
          {/* Name — hidden on very small screens */}
          <span className="hidden sm:block text-sm font-medium text-slate-700">Alex Rivera</span>
        </button>
      </div>
    </header>
  );
}
