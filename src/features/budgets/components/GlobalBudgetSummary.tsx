import { Card, CardContent } from '../../../components/ui/card';
import { BudgetProgress } from './BudgetProgress';
import type { Budget } from '../types/budget.types';

interface GlobalBudgetSummaryProps {
  budgets: Budget[];
  loading: boolean;
}

export function GlobalBudgetSummary({ budgets, loading }: GlobalBudgetSummaryProps) {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="h-24 bg-slate-100" />
          <Card className="h-24 bg-slate-100" />
          <Card className="h-24 bg-slate-100" />
        </div>
        <Card className="h-20 bg-slate-100" />
      </div>
    );
  }

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallUsage = totalBudgeted === 0 ? 0 : (totalSpent / totalBudgeted) * 100;

  let status: 'ON_TRACK' | 'WARNING' | 'EXCEEDED' = 'ON_TRACK';
  if (overallUsage >= 100) status = 'EXCEEDED';
  else if (overallUsage >= 80) status = 'WARNING';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 pt-6 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Total Budgeted</h3>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              ₹{totalBudgeted.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 pt-6 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              ₹{totalSpent.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 pt-6 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Total Remaining</h3>
            <p
              className={`text-3xl font-bold tracking-tight ${totalRemaining < 0 ? 'text-red-500' : 'text-slate-900'}`}
            >
              ₹{totalRemaining.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-6 pt-6 bg-slate-50/50">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Overall Usage</h3>
          <BudgetProgress percentageUsed={overallUsage} status={status} />
        </CardContent>
      </Card>
    </div>
  );
}
