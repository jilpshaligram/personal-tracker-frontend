import type { DocumentCategory } from '../types/documentCategory';

interface DocumentCategoryListProps {
  categories: DocumentCategory[] | undefined;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function DocumentCategoryList({
  categories: dataToUse = [],
  selectedCategoryId,
  onSelectCategory,
  isLoading,
  error,
}: DocumentCategoryListProps) {
  const categories = (() => {
    if (!dataToUse || dataToUse.length === 0) return [];

    const filteredCategories = dataToUse.filter(
      (cat) => cat.name.toLowerCase() !== 'all documents'
    );

    const hasAll = filteredCategories.some((cat) => cat._id === 'all' || cat.id === 'all');
    if (!hasAll) {
      const totalCount = filteredCategories.reduce((acc, cat) => acc + (cat.count || 0), 0);
      const allCategory: DocumentCategory = {
        id: 'all',
        _id: 'all',
        name: 'All Documents',
        status: 'ACTIVE',
        createdAt: '',
        updatedAt: '',
        count: totalCount,
      };
      return [allCategory, ...filteredCategories];
    }
    return filteredCategories;
  })();

  if (isLoading) {
    return (
      <aside className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
        </div>
        <div className="p-4 text-xs text-red-500">Error: {error.message}</div>
      </aside>
    );
  }

  if (categories.length === 0) {
    return (
      <aside className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
        </div>
        <div className="p-4 text-xs text-slate-400">No categories found.</div>
      </aside>
    );
  }

  return (
    <aside className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {categories.map((category) => (
          <button
            key={category._id || category.id}
            onClick={() => onSelectCategory(category._id || category.id)}
            className={[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1',
              selectedCategoryId === (category._id || category.id)
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            <span>{category.name}</span>
            {category.count !== undefined && (
              <span
                className={[
                  'text-xs px-1.5 py-0.5 rounded',
                  selectedCategoryId === (category._id || category.id)
                    ? 'bg-blue-500'
                    : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                {category.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
