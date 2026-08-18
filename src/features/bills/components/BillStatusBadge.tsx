import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { BillStatusBadgeProps } from '../types';

export const BillStatusBadge: React.FC<BillStatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'PAID':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Paid
        </span>
      );
    case 'PARTIALLY_PAID':
    case 'PARTIAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/60 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Partially Paid
        </span>
      );
    case 'OVERDUE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/60 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </span>
      );
    case 'UPCOMING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Upcoming
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
  }
};
