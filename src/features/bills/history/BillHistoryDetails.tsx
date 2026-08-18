import React from 'react';
import { DollarSign, CheckCircle2, AlertCircle, History, TrendingDown } from 'lucide-react';
import { BillHistoryTable } from './BillHistoryTable';
import type { BillHistoryDetailsProps } from '../types';

export const BillHistoryDetails: React.FC<BillHistoryDetailsProps> = ({
  billAmount,
  currency = 'INR',
  history,
  isLoading = false,
  totalPaid,
  remainingAmount,
  isPartiallyPaid,
  isFullyPaid,
  paidPercentage,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Total Bill</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-800">
            {formatCurrency(billAmount)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Total Paid</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-700">
            {formatCurrency(totalPaid)}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border ${
            remainingAmount > 0
              ? isPartiallyPaid
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-rose-50/60 border-rose-200'
              : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div
            className={`flex items-center gap-1 text-[11px] font-medium mb-1 ${
              remainingAmount > 0
                ? isPartiallyPaid
                  ? 'text-amber-700'
                  : 'text-rose-700'
                : 'text-slate-500'
            }`}
          >
            {remainingAmount > 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span>Remaining</span>
          </div>
          <div
            className={`text-sm sm:text-base font-bold ${
              remainingAmount > 0
                ? isPartiallyPaid
                  ? 'text-amber-800'
                  : 'text-rose-700'
                : 'text-slate-700'
            }`}
          >
            {formatCurrency(remainingAmount)}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Settlement Progress</span>
          <span className="font-bold text-slate-800">{paidPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFullyPaid ? 'bg-emerald-500' : isPartiallyPaid ? 'bg-amber-500' : 'bg-slate-300'
            }`}
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
      </div>

      {isPartiallyPaid && (
        <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Partially Paid:</span> An amount of{' '}
            <span className="font-bold text-emerald-700">{formatCurrency(totalPaid)}</span> has been
            paid. Remaining balance of{' '}
            <span className="font-bold text-amber-800">{formatCurrency(remainingAmount)}</span> is
            pending.
          </div>
        </div>
      )}

      {isFullyPaid && history.length > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            This bill has been fully settled in {history.length} payment{' '}
            {history.length === 1 ? 'transaction' : 'transactions'}.
          </span>
        </div>
      )}

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <History className="w-4 h-4 text-slate-500" />
            <span>Payment History ({history.length})</span>
          </div>
          {history.length > 0 && (
            <span className="text-[11px] text-slate-400 font-medium">Latest payment first</span>
          )}
        </div>

        <BillHistoryTable history={history} currency={currency} isLoading={isLoading} />
      </div>
    </div>
  );
};
