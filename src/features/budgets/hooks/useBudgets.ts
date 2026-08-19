import { useState, useCallback, useEffect } from 'react';
import { budgetService } from '../services/budget.service';
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '../types/budget.types';
import { getErrorMessage } from '../../../api/client';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let ignore = false;
    budgetService
      .getBudgets()
      .then((history) => {
        if (!ignore) {
          setBudgets(history || []);
          setLoadingHistory(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch budgets history', err);
        if (!ignore) {
          setBudgets([]);
          setLoadingHistory(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const createBudget = async (data: CreateBudgetDto): Promise<boolean> => {
    setActionLoading(true);
    setError(null);
    try {
      await budgetService.createBudget(data);
      fetchBudgets();
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
      fetchBudgets();
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
      fetchBudgets();
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to delete budget'));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    budgets,
    loadingHistory,
    actionLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchBudgets,
  };
}
