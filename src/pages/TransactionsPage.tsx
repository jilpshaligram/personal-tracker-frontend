import { useState } from 'react';
import { Plus, ArrowRightLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TransactionTable } from '../features/transactions/components/TransactionTable';
import { TransactionFilters } from '../features/transactions/components/TransactionFilters';
import { TransactionModal } from '../features/transactions/components/TransactionModal';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import type { Transaction } from '../features/transactions/types/transaction.types';

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
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
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

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
      <div className="space-y-8 animate-in fade-in duration-500 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="h-8 w-8 text-blue-600" />
              Transactions
            </h1>
            <p className="text-slate-500 mt-1">Manage and track your income and expenses.</p>
          </div>
          <Button onClick={handleAdd} className="shadow-sm hover:shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TransactionFilters
            filters={filters}
            categories={categories}
            onFilterChange={updateFilters}
          />

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
          />
        </div>

        <TransactionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          initialData={editingTransaction}
          categories={categories}
          onCreateCategory={createTransactionCategory}
        />
      </div>
    </div>
  );
}
