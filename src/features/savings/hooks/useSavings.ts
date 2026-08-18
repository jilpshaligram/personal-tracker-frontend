import { useState, useEffect, useCallback } from 'react';
import type { SavingGoal, SavingGoalFilter } from '../types/savingGoal';
import {
  fetchSavingGoals,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
  depositSavingGoal,
  withdrawSavingGoal,
} from '../services/savingService';

export function useSavings(initialFilter: SavingGoalFilter = { page: 1, limit: 100 }) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SavingGoalFilter>(initialFilter);
  const [total, setTotal] = useState(0);

  const loadGoals = useCallback(
    async (currentFilter: SavingGoalFilter = filter) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchSavingGoals(currentFilter);
        setGoals(response.data || []);
        setTotal(response.meta?.total || 0);
      } catch (err) {
        setError('Failed to fetch savings goals.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  const handleCreateGoal = async (
    goalData: Omit<
      SavingGoal,
      'id' | 'userId' | 'savedAmount' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'
    >
  ) => {
    try {
      await createSavingGoal(goalData);
      await loadGoals();
    } catch (err) {
      console.error('Failed to create saving goal:', err);
      throw err;
    }
  };

  const handleUpdateGoal = async (
    id: string,
    goalData: Partial<
      Omit<
        SavingGoal,
        'id' | 'userId' | 'savedAmount' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'
      >
    >
  ) => {
    try {
      await updateSavingGoal(id, goalData);
      await loadGoals();
    } catch (err) {
      console.error('Failed to update saving goal:', err);
      throw err;
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteSavingGoal(id);
      await loadGoals();
    } catch (err) {
      console.error('Failed to delete saving goal:', err);
      throw err;
    }
  };

  const handleDepositFunds = async (id: string, amount: number) => {
    try {
      await depositSavingGoal(id, amount);
      await loadGoals();
    } catch (err) {
      console.error('Failed to deposit funds:', err);
      throw err;
    }
  };

  const handleWithdrawFunds = async (id: string, amount: number) => {
    try {
      await withdrawSavingGoal(id, amount);
      await loadGoals();
    } catch (err) {
      console.error('Failed to withdraw funds:', err);
      throw err;
    }
  };

  const applyFilter = useCallback(
    (newFilter: Partial<SavingGoalFilter>) => {
      const updated = { ...filter, ...newFilter };
      setFilter(updated);
      void loadGoals(updated);
    },
    [filter, loadGoals]
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    void loadGoals();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [loadGoals]);

  return {
    goals,
    total,
    loading,
    error,
    filter,
    loadGoals,
    createGoal: handleCreateGoal,
    updateGoal: handleUpdateGoal,
    deleteGoal: handleDeleteGoal,
    depositFunds: handleDepositFunds,
    withdrawFunds: handleWithdrawFunds,
    applyFilter,
  };
}
