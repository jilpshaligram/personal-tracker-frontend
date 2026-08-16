import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { BudgetProgress } from './BudgetProgress';
import type { Budget } from '../types/budget.types';

interface BudgetSummaryProps {
  budget: Budget | null;
  loading: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function BudgetSummary({ budget, loading }: BudgetSummaryProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-16 bg-slate-100" />
        <CardContent className="h-32 bg-slate-50" />
      </Card>
    );
  }

  if (!budget) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <h3 className="text-lg font-medium text-slate-900 mt-4">No active budget</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            Create a budget to start tracking your spending.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { amount, spent, remaining, percentageUsed, status, period, startDate, endDate } = budget;

  let badgeVariant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let badgeText = 'ON TRACK';

  if (status === 'WARNING') {
    badgeVariant = 'default';
    badgeText = 'WARNING';
  } else if (status === 'EXCEEDED') {
    badgeVariant = 'destructive';
    badgeText = 'EXCEEDED';
  }

  const periodLabel = period.charAt(0) + period.slice(1).toLowerCase();

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="bg-slate-900 text-slate-50 px-6 py-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Current Budget</h3>
        </div>
        <Badge
          variant={badgeVariant}
          className="bg-white/20 text-white hover:bg-white/30 border-none"
        >
          {badgeText}
        </Badge>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">₹{amount.toFixed(2)}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">{periodLabel} Budget</p>
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-700">
              ₹{spent.toFixed(2)}
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">Spent</p>
          </div>
          <div>
            <p
              className={`text-xl font-semibold tracking-tight ${remaining < 0 ? 'text-red-500' : 'text-slate-700'}`}
            >
              ₹{remaining.toFixed(2)}
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">Remaining</p>
          </div>
        </div>

        <BudgetProgress percentageUsed={percentageUsed} status={status} className="mb-4" />

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {period}
          </div>
          <div className="text-sm text-slate-500">
            {startDate ? formatDate(startDate) : ''} {endDate ? `→ ${formatDate(endDate)}` : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
