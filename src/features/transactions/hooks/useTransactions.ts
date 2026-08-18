import { useState, useCallback, useEffect } from 'react';
import { transactionService } from '../services/transaction.service';
import type {
  Transaction,
  TransactionCategory,
  TransactionFilterDto,
} from '../types/transaction.types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalRows, setTotalRows] = useState(0);

  const [filters, setFilters] = useState<TransactionFilterDto>({
    page: 1,
    limit: 10,
    type: undefined,
    categoryId: undefined,
    search: '',
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.getTransactions(filters);
      setTransactions(result.data || []);
      setTotalRows(result.total || 0);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDependencies = useCallback(async () => {
    try {
      const [cats] = await Promise.all([transactionService.getTransactionCategories()]);
      setCategories(
        Array.isArray(cats) ? cats : (cats as { data?: TransactionCategory[] }).data || []
      );
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchDependencies();
    })();
  }, [fetchDependencies]);

  useEffect(() => {
    void (async () => {
      await fetchTransactions();
    })();
  }, [fetchTransactions]);

  const updateFilters = (newFilters: Partial<TransactionFilterDto>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const createTransaction = async (data: Partial<Transaction>) => {
    try {
      await transactionService.createTransaction(data);
      await fetchTransactions();
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to create transaction');
      return false;
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await transactionService.updateTransaction(id, data);
      await fetchTransactions();
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to update transaction');
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      await fetchTransactions();
      return true;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to delete transaction');
      return false;
    }
  };

  const createTransactionCategory = async (data: Partial<TransactionCategory>) => {
    try {
      const newCategory = await transactionService.createTransactionCategory(data);
      await fetchDependencies();
      return newCategory;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      throw new Error(error?.response?.data?.message || 'Failed to create custom category', {
        cause: err,
      });
    }
  };

  return {
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
    deleteTransaction,
    createTransactionCategory,
    refetch: fetchTransactions,
  };
}
