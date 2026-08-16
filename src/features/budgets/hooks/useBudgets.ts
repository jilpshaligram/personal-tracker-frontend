import { useState, useCallback, useEffect } from 'react';
import { budgetService } from '../services/budget.service';
import type {
  Budget,
  CategoryBreakdownResponse,
  CreateBudgetDto,
  UpdateBudgetDto,
} from '../types/budget.types';
import { getErrorMessage } from '../../../api/client';

export function useBudgets() {
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownResponse | null>(
    null
  );

  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchCurrentBudget = useCallback(async () => {
    setLoadingCurrent(true);
    setError(null);
    try {
      const budget = await budgetService.getCurrentBudget();
      setCurrentBudget(budget);
      return budget;
    } catch (err) {
      console.warn('No current budget or failed to fetch', err);
      setCurrentBudget(null);
      return null;
    } finally {
      setLoadingCurrent(false);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const history = await budgetService.getBudgets();
      setBudgets(history || []);
    } catch (err) {
      console.error('Failed to fetch budgets history', err);
      setBudgets([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchCategoryBreakdown = useCallback(async (budgetId: string) => {
    setLoadingBreakdown(true);
    try {
      const breakdown = await budgetService.getCategoryBreakdown(budgetId);
      setCategoryBreakdown(breakdown);
    } catch (err) {
      console.error('Failed to fetch category breakdown', err);
      setCategoryBreakdown(null);
    } finally {
      setLoadingBreakdown(false);
    }
  }, []);

  const initData = useCallback(async () => {
    const budget = await fetchCurrentBudget();
    fetchBudgets();
    if (budget) {
      fetchCategoryBreakdown(budget.id);
    } else {
      setCategoryBreakdown(null);
    }
  }, [fetchCurrentBudget, fetchBudgets, fetchCategoryBreakdown]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initData();
  }, [initData]);

  const createBudget = async (data: CreateBudgetDto): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await budgetService.createBudget(data);
      await initData();
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create budget'));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateBudget = async (id: string, data: UpdateBudgetDto): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await budgetService.updateBudget(id, data);
      await initData();
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update budget'));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await budgetService.deleteBudget(id);
      await initData();
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to delete budget'));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    currentBudget,
    budgets,
    categoryBreakdown,
    loadingCurrent,
    loadingHistory,
    loadingBreakdown,
    actionLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refresh: initData,
  };
}
