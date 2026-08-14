import { Search, Grid3x3, List, Upload } from 'lucide-react';
import type { DocumentViewMode } from '../types/document';

interface DocumentFiltersProps {
  searchQuery: string;
  viewMode: DocumentViewMode;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: DocumentViewMode) => void;
  onUploadClick: () => void;
}

export function DocumentFilters({
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
  onUploadClick,
}: DocumentFiltersProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Document Vault</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={[
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600',
              ].join(' ')}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={[
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600',
              ].join(' ')}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </header>
  );
}
