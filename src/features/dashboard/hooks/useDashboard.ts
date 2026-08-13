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
    setLoading(true);
    setError(null);
    try {
      // In a real application, these would be Promise.all to fetch concurrently.
      const [statsData, budgetData, categoryData, docsData, billsData, txData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getBudgetOverview(period),
        dashboardService.getCategoryBreakdown(period),
        dashboardService.getDocumentAlerts(),
        dashboardService.getUpcomingBills(),
        dashboardService.getRecentTransactions(),
      ]);

      setStats(statsData);
      setBudgetOverview(budgetData);
      setCategoryBreakdown(categoryData);
      setDocumentAlerts(docsData);
      setUpcomingBills(billsData);
      setRecentTransactions(txData);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
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
