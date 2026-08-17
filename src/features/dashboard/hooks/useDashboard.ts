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
import { getDateRange } from '../utils/date.utils';

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
      const { startDate, endDate } = getDateRange(period);

      // 1. Fetch all parallel independent data (transactions, docs, bills)
      const [transactions, docsData, billsData] = await Promise.all([
        dashboardService.getTransactionsForPeriod(startDate, endDate),
        dashboardService.getDocumentAlerts(),
        dashboardService.getUpcomingBills(),
      ]);

      // 2. Calculate Income and Expense
      let income = 0;
      let expense = 0;
      transactions.forEach((tx) => {
        if (tx.type === 'INCOME') income += tx.amount;
        if (tx.type === 'EXPENSE') expense += tx.amount;
      });

      // 3. Fetch dependent data
      const [statsData, budgetData, categoryData] = await Promise.all([
        dashboardService.getStats(income, expense),
        dashboardService.getBudgetOverview(),
        dashboardService.getCategoryBreakdown(period, transactions, expense),
      ]);

      setStats(statsData);
      setBudgetOverview(budgetData);
      setCategoryBreakdown(categoryData);
      setDocumentAlerts(docsData);
      setUpcomingBills(billsData);
      setRecentTransactions(dashboardService.mapRecentTransactions(transactions));
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
