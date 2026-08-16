import { Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import type { Budget } from '../types/budget.types';

interface BudgetHistoryProps {
  budgets: Budget[];
  loading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function BudgetHistory({ budgets, loading, onEdit, onDelete }: BudgetHistoryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse h-64">
        <div className="bg-slate-50 h-12 border-b border-slate-200" />
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <p className="text-slate-500">No budget history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200 hidden sm:table-header-group">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Period
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Dates
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Budget Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {budgets.map((budget) => {
            let badgeVariant: 'default' | 'secondary' | 'destructive' = 'secondary';
            if (budget.status === 'WARNING') badgeVariant = 'default';
            if (budget.status === 'EXCEEDED') badgeVariant = 'destructive';

            return (
              <tr key={budget.id} className="hover:bg-slate-50 flex flex-col sm:table-row">
                <td className="px-4 py-3 sm:py-4">
                  <div className="font-medium text-slate-900 capitalize">
                    {budget.period.toLowerCase()}
                  </div>
                  <div className="sm:hidden text-xs text-slate-500 mt-1">
                    {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-sm text-slate-600">
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                  ₹{budget.amount.toFixed(2)}
                  <div className="sm:hidden font-normal text-slate-500 text-xs">Budget</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={badgeVariant}>{budget.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(budget)}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                      title="Edit Budget"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to deactivate this budget?')) {
                          onDelete(budget.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-100 rounded text-red-500 transition-colors"
                      title="Delete Budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
