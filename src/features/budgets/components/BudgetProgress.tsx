export interface BudgetProgressProps {
  percentageUsed: number;
  status: 'ON_TRACK' | 'WARNING' | 'EXCEEDED';
  className?: string;
}

export function BudgetProgress({ percentageUsed, status, className = '' }: BudgetProgressProps) {
  let indicatorColor = 'bg-emerald-500';
  if (status === 'WARNING') indicatorColor = 'bg-amber-500';
  if (status === 'EXCEEDED') indicatorColor = 'bg-red-500';

  const displayPercentage = Math.min(percentageUsed, 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full flex-1 transition-all duration-500 ease-in-out ${indicatorColor}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <p className="text-right text-xs font-medium text-slate-500">
        {percentageUsed.toFixed(1)}% Used
      </p>
    </div>
  );
}
