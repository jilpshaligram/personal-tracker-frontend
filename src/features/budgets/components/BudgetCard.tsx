import { Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { BudgetProgress } from './BudgetProgress';
import type { Budget } from '../types/budget.types';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  let badgeVariant: 'default' | 'secondary' | 'destructive' = 'secondary';
  let badgeText = 'ON TRACK';

  if (budget.status === 'WARNING') {
    badgeVariant = 'default';
    badgeText = 'WARNING';
  } else if (budget.status === 'EXCEEDED') {
    badgeVariant = 'destructive';
    badgeText = 'EXCEEDED';
  }

  const periodLabel = budget.period.charAt(0) + budget.period.slice(1).toLowerCase();

  return (
    <Card className="overflow-hidden shadow-sm flex flex-col">
      <div className="bg-slate-50 text-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <div>
          <h3 className="text-lg font-medium">{periodLabel} Budget</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={badgeVariant} className="shadow-none">
            {badgeText}
          </Badge>
          <div className="flex gap-1 ml-2 border-l pl-3 border-slate-200">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
              title="Edit Budget"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this budget?')) {
                  onDelete(budget.id);
                }
              }}
              className="p-1.5 hover:bg-red-100 rounded text-red-500 transition-colors"
              title="Delete Budget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="text-sm text-slate-500 mb-6">
          {budget.startDate ? formatDate(budget.startDate) : ''}{' '}
          {budget.endDate ? `→ ${formatDate(budget.endDate)}` : ''}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Budgeted</span>
            <span className="font-semibold text-slate-900">₹{budget.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Spent</span>
            <span className="font-semibold text-slate-900">₹{budget.spent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Remaining</span>
            <span
              className={`font-semibold ${budget.remaining < 0 ? 'text-red-500' : 'text-slate-900'}`}
            >
              ₹{budget.remaining.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <BudgetProgress percentageUsed={budget.percentageUsed} status={budget.status} />
        </div>
      </CardContent>
    </Card>
  );
}
