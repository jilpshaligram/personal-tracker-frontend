import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  Globe,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { BillHistoryTableProps } from '../types';

export const BillHistoryTable: React.FC<BillHistoryTableProps> = ({
  history,
  currency = 'INR',
  isLoading = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  };

  const getMethodIcon = (method?: string) => {
    const m = (method || '').toUpperCase();
    switch (m) {
      case 'CARD':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
      case 'BANK_TRANSFER':
        return <Building className="w-3.5 h-3.5 text-blue-500" />;
      case 'NET_BANKING':
        return <Globe className="w-3.5 h-3.5 text-cyan-500" />;
      case 'CASH':
        return <Banknote className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-slate-100">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading payment records...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="py-6 px-4 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200">
        <p className="text-xs text-slate-500">No payment transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 select-none">
              <th className="px-3.5 py-2.5 font-semibold">Date & Time</th>
              <th className="px-3.5 py-2.5 font-semibold">Amount Paid</th>
              <th className="px-3.5 py-2.5 font-semibold">Method</th>
              <th className="px-3.5 py-2.5 font-semibold">Transaction ID</th>
              <th className="px-3.5 py-2.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {history.map((item, idx) => {
              const itemId = item.id || item._id || `item-${idx}`;
              const txnId = item.transactionId || item.id || '-';
              const isCopied = copiedId === itemId;

              return (
                <tr key={itemId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDateTime(item.paymentDate || item.createdAt)}</span>
                    </div>
                    {item.notes && (
                      <div
                        className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate"
                        title={item.notes}
                      >
                        Notes: {item.notes}
                      </div>
                    )}
                  </td>

                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className="font-bold text-emerald-600 text-xs">
                      {formatCurrency(item.amountPaid)}
                    </span>
                  </td>

                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                      {getMethodIcon(item.paymentMethod)}
                      {item.paymentMethod || 'OTHER'}
                    </span>
                  </td>

                  <td className="px-3.5 py-3 whitespace-nowrap">
                    {txnId !== '-' ? (
                      <button
                        type="button"
                        onClick={() => handleCopy(txnId, itemId)}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-slate-200/70 transition-colors"
                        title="Click to copy Transaction ID"
                      >
                        <span className="max-w-[100px] sm:max-w-[140px] truncate">{txnId}</span>
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td className="px-3.5 py-3 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status || 'PAID'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
