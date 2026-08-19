import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tag } from 'lucide-react';
import type { CategoryBreakdownResponse } from '../types/budget.types';

interface BudgetCategoryChartProps {
  data: CategoryBreakdownResponse | null;
  loading: boolean;
}

const COLORS = [
  'bg-blue-600',
  'bg-amber-500',
  'bg-red-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-pink-600',
  'bg-indigo-600',
];

export function BudgetCategoryChart({ data, loading }: BudgetCategoryChartProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-20 bg-slate-100" />
        <CardContent className="h-64 bg-slate-50" />
      </Card>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <Card className="border-none shadow-sm h-full">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <p className="text-sm text-slate-500 mt-1">No expense data available for this period.</p>
        </CardHeader>
      </Card>
    );
  }

  const sortedCategories = [...data.categories].sort((a, b) => b.amount - a.amount);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-slate-800">Category Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedCategories.map((cat, index) => {
            const percentage = data.spentAmount > 0 ? (cat.amount / data.spentAmount) * 100 : 0;
            const colorClass = COLORS[index % COLORS.length];

            return (
              <div key={cat.categoryId} className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{cat.categoryName}</h4>
                      <p className="text-xs text-slate-500 font-medium">Expense Category</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{cat.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
