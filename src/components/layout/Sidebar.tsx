import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ArrowLeftRight,
  WalletCards,
  Receipt,
  PiggyBank,
  Settings,
  Plus,
  X,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: WalletCards },
  // { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/bills', label: 'Bills', icon: Receipt },
  { path: '/savings', label: 'Savings', icon: PiggyBank },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 z-30 flex h-full w-64 flex-col bg-white border-r border-slate-200 shadow-sm',
          'transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0 lg:z-auto lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <span className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-blue-600 text-white font-bold text-base select-none shrink-0 group-hover:scale-[1.02] transition-transform">
              V
            </span>
            <div>
              <span className="block text-base font-bold text-slate-800 leading-tight tracking-tight">
                VaultSaaS
              </span>
              <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                Personal Finance
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3" role="navigation">
          <ul className="flex flex-col gap-0.5" role="list">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-600" />
                      )}
                      <Icon
                        className={[
                          'w-4.5 h-4.5 shrink-0 transition-colors duration-150',
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600',
                        ].join(' ')}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-5 border-t border-slate-100">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150"
            aria-label="Add a new transaction"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            Add Transaction
          </button>
        </div>
      </aside>
    </>
  );
}
