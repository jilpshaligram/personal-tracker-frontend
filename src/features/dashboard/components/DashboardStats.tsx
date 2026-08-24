import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { DashboardStats as DashboardStatsType, Period } from '../types';

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
  loading: boolean;
  period: Period;
}

export function DashboardStats({ stats, loading, period }: DashboardStatsProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Current Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <span className="text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wallet"
            >
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-5-1.52" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </span>
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold truncate"
            title={stats ? formatCurrency(stats.currentBalance) : ''}
          >
            {loading ? '---' : stats ? formatCurrency(stats.currentBalance) : '₹0.00'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total across all wallets</p>
        </CardContent>
      </Card>

      {/* 2. Dynamic Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{periodLabel} Income</CardTitle>
          <span className="text-emerald-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trending-up"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </span>
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold truncate"
            title={stats ? formatCurrency(stats.monthlyIncome) : ''}
          >
            {loading ? '---' : stats ? formatCurrency(stats.monthlyIncome) : '₹0.00'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on transactions</p>
        </CardContent>
      </Card>

      {/* 3. Dynamic Expense */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{periodLabel} Expense</CardTitle>
          <span className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trending-down"
            >
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
              <polyline points="16 17 22 17 22 11" />
            </svg>
          </span>
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold truncate"
            title={stats ? formatCurrency(stats.monthlyExpense) : ''}
          >
            {loading ? '---' : stats ? formatCurrency(stats.monthlyExpense) : '₹0.00'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on transactions</p>
        </CardContent>
      </Card>

      {/* 4. Total Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <span className="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-piggy-bank"
            >
              <path d="M19 5c-1.5 0-2.8 1.4-3.1 2a3.1 3.1 0 0 0-2.79-1.94c-1.35 0-2.65 1.39-2.92 2H8.38a3.1 3.1 0 0 0-2.8-1.94C4.19 5 3 6.4 3 8v3.5A3.5 3.5 0 0 0 6.5 15h11a3.5 3.5 0 0 0 3.5-3.5V8c0-1.6-1.19-3-2-3Z" />
              <path d="M8 15v2" />
              <path d="M16 15v2" />
              <path d="M12 9v.01" />
            </svg>
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className="text-2xl font-bold truncate max-w-full"
              title={stats ? formatCurrency(stats.totalSavings) : ''}
            >
              {loading ? '---' : stats ? formatCurrency(stats.totalSavings) : '₹0.00'}
            </span>
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
              / {loading ? '---' : stats ? formatCurrency(stats.totalTargetSavings) : '₹0.00'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Saved / Target for active goals</p>
        </CardContent>
      </Card>
    </div>
  );
}
