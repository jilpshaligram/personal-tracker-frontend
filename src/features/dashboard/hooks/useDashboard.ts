import { useState, useEffect, useCallback } from 'react';
import type {
  Period,
  BudgetOverview,
  CategoryBreakdown,
  DocumentAlert,
  UpcomingBill,
  RecentTransaction,
  DashboardStats,
} from '../types';
import { dashboardService } from '../services/dashboard.service';

export function useDashboard() {
  const [period, setPeriod] = useState<Period>('monthly');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown | null>(null);
  const [documentAlerts, setDocumentAlerts] = useState<DocumentAlert[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);

  const fetchDashboardData = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardSummary(period);

      setStats(data.stats);

      setBudgetOverview({
        ...data.budgetOverview,
        period: data.budgetOverview.period.toLowerCase() as Period,
      });

      setCategoryBreakdown({
        period: (data.period || period).toLowerCase() as Period,
        totalSpent: data.budgetOverview?.totalSpent || 0,
        categories: data.categoryBreakdown?.categories || [],
      });

      setDocumentAlerts(data.documentAlerts || []);
      setUpcomingBills(data.upcomingBills || []);
      setRecentTransactions(data.recentTransactions || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    period,
    setPeriod,
    loading,
    error,
    stats,
    budgetOverview,
    categoryBreakdown,
    documentAlerts,
    upcomingBills,
    recentTransactions,
    refetch: fetchDashboardData,
  };
}
