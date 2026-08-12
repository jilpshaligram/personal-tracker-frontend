import { Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  comingSoonText: string;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
  comingSoonText,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 max-w-4xl">
      {/* Inline search bar */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search transactions or docs..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 shadow-sm transition-all duration-150"
          aria-label="Search transactions or documents"
        />
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {/* Placeholder card */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
          <Icon className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">{comingSoonText}</p>
          <p className="mt-1 text-xs text-slate-400">
            This section is under construction and will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
