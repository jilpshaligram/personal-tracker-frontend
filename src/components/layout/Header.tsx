import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpCircle, Menu, User, LogOut } from 'lucide-react';
import { useHelpStore } from '../../store';
import { NotificationBell } from '../../features/notifications';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const setIsHelpOpen = useHelpStore((state) => state.setIsOpen);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User'
    : 'User';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
        <NotificationBell />

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Get help"
        >
          <HelpCircle className="w-4.5 h-4.5" strokeWidth={1.75} />
        </button>

        <div className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0 select-none"
              aria-hidden="true"
            >
              {getInitials()}
            </span>
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {displayName}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Profile</span>
              </Link>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
