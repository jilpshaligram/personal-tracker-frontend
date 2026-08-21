import { useState, useEffect } from 'react';
import { Plus, Search, X, AlertTriangle, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { TransactionTable } from '../features/transactions/components/TransactionTable';
import { TransactionModal } from '../features/transactions/components/TransactionModal';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import type {
  Transaction,
  TransactionType,
} from '../features/transactions/types/transaction.types';

export default function TransactionsPage() {
  const {
    transactions,
    categories,
    loading,
    error,
    filters,
    totalRows,
    updateFilters,
    changePage,
    createTransaction,
    updateTransaction,
    createTransactionCategory,
    deleteTransaction,
    refetch,
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [prevSearchFilter, setPrevSearchFilter] = useState(filters.search);

  const handleRefresh = () => {
    setSearchTerm('');
    updateFilters({
      search: undefined,
      type: undefined,
      categoryId: undefined,
      page: 1,
    });
    refetch();
  };

  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search);
    setSearchTerm(filters.search || '');
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQuery = filters.search || '';
      const newQuery = searchTerm.trim();
      if (currentQuery !== newQuery) {
        updateFilters({ search: newQuery || undefined });
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, filters.search, updateFilters]);

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsSubmitting(true);
    try {
      const id = (deletingTransaction.id || deletingTransaction._id) as string;
      await deleteTransaction(id);
      setDeletingTransaction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: Partial<Transaction>) => {
    if (editingTransaction) {
      return await updateTransaction(
        (editingTransaction.id || editingTransaction._id) as string,
        data
      );
    } else {
      return await createTransaction(data);
    }
  };

  const filteredCategories = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-6 w-full max-w-[1600px] 2xl:max-w-[1800px]">
        {/* Heading Section */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track your income and expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Search */}
          <div className="relative w-full sm:max-w-[280px] shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
              aria-label="Search transactions"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateFilters({ search: undefined });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Filters and Actions */}
          <div className="flex flex-wrap items-center lg:justify-end gap-3 w-full lg:w-auto">
            <select
              value={filters.type || ''}
              onChange={(e) => {
                const type =
                  e.target.value === '' ? undefined : (e.target.value as TransactionType);
                updateFilters({ type, categoryId: undefined });
              }}
              className="px-3 py-2 text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium shadow-sm transition-all cursor-pointer"
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            <select
              value={filters.categoryId || ''}
              onChange={(e) => updateFilters({ categoryId: e.target.value || undefined })}
              className="px-3 py-2 text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium shadow-sm transition-all max-w-[200px] cursor-pointer"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {filteredCategories.map((cat) => {
                const catId = cat.id || (cat as { _id?: string })._id || '';
                return (
                  <option key={catId} value={catId}>
                    {cat.name}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm shrink-0 cursor-pointer"
              title="Refresh transactions and clear filters"
              aria-label="Refresh transactions and clear filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <TransactionTable
          transactions={transactions}
          loading={loading}
          page={filters.page || 1}
          limit={filters.limit || 10}
          totalRows={totalRows}
          onPageChange={changePage}
          categories={categories}
          currentSort={{
            field: filters.sortBy || 'transactionDate',
            order: filters.sortOrder || 'desc',
          }}
          onSortChange={(field, order) => updateFilters({ sortBy: field, sortOrder: order })}
          onLimitChange={(newLimit) => updateFilters({ limit: newLimit })}
          onEdit={handleEdit}
          onDelete={(transaction) => setDeletingTransaction(transaction)}
        />

        <TransactionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          initialData={editingTransaction}
          categories={categories}
          onCreateCategory={createTransactionCategory}
        />

        {deletingTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Delete Transaction</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete this{' '}
                  <span className="font-semibold text-slate-700">
                    {deletingTransaction.type === 'INCOME' ? 'income' : 'expense'}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-700">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 2,
                    }).format(deletingTransaction.amount)}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingTransaction(null)}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
