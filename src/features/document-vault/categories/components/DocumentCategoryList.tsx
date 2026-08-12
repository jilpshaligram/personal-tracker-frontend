import { useDocumentCategories } from '../hooks/useDocumentCategories';
import type { DocumentCategory } from '../types/documentCategory';

interface DocumentCategoryListProps {
  categories?: DocumentCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function DocumentCategoryList({
  selectedCategoryId,
  onSelectCategory,
}: DocumentCategoryListProps) {
  const { data = [], isLoading: loading, error } = useDocumentCategories();

  const categories = (() => {
    if (!data || data.length === 0) return [];

    const hasAll = data.some((cat) => cat._id === 'all' || cat.id === 'all');
    if (!hasAll) {
      const totalCount = data.reduce((acc, cat) => acc + (cat.count || 0), 0);
      const allCategory: DocumentCategory = {
        id: 'all',
        _id: 'all',
        name: 'All Documents',
        status: 'ACTIVE',
        createdAt: '',
        updatedAt: '',
        count: totalCount,
      };
      return [allCategory, ...data];
    }
    return data;
  })();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="px-3 py-4 text-sm text-red-500">Error: {error.message}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-slate-500">
        No categories found.
      </div>
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
