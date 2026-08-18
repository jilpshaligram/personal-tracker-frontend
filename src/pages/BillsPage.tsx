import { useState, useEffect } from 'react';
import { Search, X, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { BillTable, BillForm, BillDetails, PayBillDialog, useBills } from '../features/bills';
import type { Bill, CreateBillPayload, PayBillPayload } from '../features/bills';

export default function BillsPage() {
  const {
    bills,
    totalBills,
    categories,
    isLoading,
    error,
    filters,
    sortField,
    sortOrder,
    handleSort,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleCreateBill,
    handleUpdateBill,
    handleDeleteBill,
    handleMarkAsPaid,
    handleFilterChange,
    refresh,
  } = useBills();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [prevSearchFilter, setPrevSearchFilter] = useState(filters.search);

  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search);
    setSearchTerm(filters.search || '');
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQuery = filters.search || '';
      const newQuery = searchTerm.trim();
      if (currentQuery !== newQuery) {
        handleFilterChange({ search: newQuery || undefined });
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, filters.search, handleFilterChange]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [payDefaultAmount, setPayDefaultAmount] = useState<number | undefined>(undefined);
  const [deletingBill, setDeletingBill] = useState<Bill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingBill(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (bill: Bill) => {
    setEditingBill(bill);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: CreateBillPayload) => {
    setIsSubmitting(true);
    try {
      if (editingBill) {
        const id = editingBill.id || editingBill._id || '';
        await handleUpdateBill(id, payload);
      } else {
        await handleCreateBill(payload);
      }
      setIsFormOpen(false);
      setEditingBill(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPay = (bill: Bill, remainingAmount?: number) => {
    setPayingBill(bill);
    setPayDefaultAmount(remainingAmount);
  };

  const handleConfirmPay = async (billId: string, payload: PayBillPayload) => {
    setIsSubmitting(true);
    try {
      await handleMarkAsPaid(billId, payload);
      setPayingBill(null);
      setPayDefaultAmount(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBill) return;
    setIsSubmitting(true);
    try {
      const id = deletingBill.id || deletingBill._id || '';
      await handleDeleteBill(id);
      setDeletingBill(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-6 w-full max-w-[1600px] 2xl:max-w-[1800px]">
        <div className="relative w-full sm:max-w-md lg:max-w-lg">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions or docs..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 shadow-xs transition-all"
            aria-label="Search transactions or documents"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                handleFilterChange({ search: undefined });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Bills</h1>
            <p className="mt-1 text-sm text-slate-500">
              Set and monitor your upcoming and recurring bills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap xl:justify-end">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all shadow-2xs shrink-0"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="UPCOMING">Upcoming</option>
            </select>

            <select
              value={filters.categoryId || ''}
              onChange={(e) => handleFilterChange({ categoryId: e.target.value })}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all shadow-2xs shrink-0 max-w-[180px]"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const catId = cat.id || cat._id || '';
                return (
                  <option key={catId} value={catId}>
                    {cat.name}
                  </option>
                );
              })}
            </select>

            <select
              value={
                filters.isRecurring === undefined ? '' : filters.isRecurring ? 'true' : 'false'
              }
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange({
                  isRecurring: val === '' ? undefined : val === 'true',
                });
              }}
              className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all shadow-2xs shrink-0"
              aria-label="Filter by recurrence"
            >
              <option value="">All Types</option>
              <option value="true">Recurring Only</option>
              <option value="false">One-Time Only</option>
            </select>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={refresh}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-2xs"
                title="Refresh bills"
                aria-label="Refresh bills"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Bill</span>
              </button>
            </div>
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
              onClick={refresh}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <BillTable
          bills={bills}
          totalBills={totalBills}
          categories={categories}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onViewDetails={(bill) => setSelectedBill(bill)}
          onEdit={handleOpenEdit}
          onDelete={(bill) => setDeletingBill(bill)}
          onMarkAsPaid={(bill) => handleOpenPay(bill)}
          onAddNew={handleOpenCreate}
        />

        <BillForm
          key={
            isFormOpen ? (editingBill ? editingBill.id || editingBill._id : 'new-bill') : 'closed'
          }
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBill(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingBill}
          categories={categories}
          isSubmitting={isSubmitting}
        />

        <BillDetails
          isOpen={Boolean(selectedBill)}
          bill={selectedBill}
          categories={categories}
          onClose={() => setSelectedBill(null)}
          onPay={(bill, remaining) => handleOpenPay(bill, remaining)}
        />

        <PayBillDialog
          isOpen={Boolean(payingBill)}
          bill={payingBill}
          defaultAmount={payDefaultAmount}
          onClose={() => {
            setPayingBill(null);
            setPayDefaultAmount(undefined);
          }}
          onConfirm={handleConfirmPay}
          isSubmitting={isSubmitting}
        />

        {deletingBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Delete Bill</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-slate-700">
                    &quot;{deletingBill.title}&quot;
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingBill(null)}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs"
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
