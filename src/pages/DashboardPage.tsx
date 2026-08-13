import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { DashboardStats } from '../features/dashboard/components/DashboardStats';
import { BudgetOverview } from '../features/dashboard/components/BudgetOverview';
import { CategorySpending } from '../features/dashboard/components/CategorySpending';
import { DocumentOverview } from '../features/dashboard/components/DocumentOverview';
import { BillsOverview } from '../features/dashboard/components/BillsOverview';
import { RecentTransactions } from '../features/dashboard/components/RecentTransactions';
import type { Period } from '../features/dashboard/types';

export default function DashboardPage() {
  const {
    period,
    setPeriod,
    loading,
    stats,
    budgetOverview,
    categoryBreakdown,
    documentAlerts,
    upcomingBills,
    recentTransactions,
  } = useDashboard();

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back! Here's an overview of your finances.</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Summary Cards (Pending Implementation) */}
        <DashboardStats stats={stats} loading={loading} />

        {/* Middle Section: Budget & Document Alerts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-2 lg:col-span-4">
            <BudgetOverview data={budgetOverview} loading={loading} />
          </div>
          <div className="col-span-2 lg:col-span-3">
            <DocumentOverview alerts={documentAlerts} loading={loading} />
          </div>
        </div>

        {/* Categories Section */}
        <div className="grid gap-6">
          <CategorySpending data={categoryBreakdown} period={period} loading={loading} />
        </div>

        {/* Bottom Section: Recent Transactions & Upcoming Bills */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-2 lg:col-span-4">
            <RecentTransactions transactions={recentTransactions} loading={loading} />
          </div>
          <div className="col-span-2 lg:col-span-3">
            <BillsOverview bills={upcomingBills} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
