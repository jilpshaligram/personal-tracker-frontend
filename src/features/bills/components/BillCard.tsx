import React from 'react';
import { Calendar, Repeat, MoreVertical, CheckCircle } from 'lucide-react';
import { BillStatusBadge } from './BillStatusBadge';
import type { BillCardProps } from '../types';

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  categories,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkAsPaid,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const getCategoryName = () => {
    if (typeof bill.category === 'object' && bill.category?.name) return bill.category.name;
    const found = categories.find((c) => (c.id || c._id) === bill.categoryId);
    return found ? found.name : 'General';
  };

  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
    }).format(amount);
  };

  const isPaid = bill.status?.toUpperCase() === 'PAID';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
            {getCategoryName()}
          </span>
          <BillStatusBadge status={bill.status} />
        </div>

        <h4 className="font-bold text-slate-800 text-sm tracking-tight line-clamp-1">
          {bill.title}
        </h4>

        {bill.notes && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{bill.notes}</p>}

        <div className="mt-3 text-lg font-bold text-slate-900">
          {formatCurrency(bill.amount, bill.currency)}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{bill.dueDate ? bill.dueDate.split('T')[0] : '-'}</span>
          {(bill.isRecurring === true || (bill.isRecurring as unknown) === 'true') && (
            <span title="Recurring">
              <Repeat className="w-3 h-3 text-blue-500 ml-1" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 relative">
          <button
            type="button"
            onClick={() => !isPaid && onMarkAsPaid(bill)}
            disabled={isPaid}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md shadow-xs transition-colors ${
              isPaid
                ? 'bg-emerald-50 text-emerald-400 cursor-not-allowed border border-emerald-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            {isPaid ? 'Paid' : 'Pay'}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onViewDetails(bill);
                }}
                className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPaid) return;
                  setIsMenuOpen(false);
                  onEdit(bill);
                }}
                disabled={isPaid}
                className={`w-full px-3 py-1.5 text-left text-xs ${
                  isPaid ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPaid) return;
                  setIsMenuOpen(false);
                  onDelete(bill);
                }}
                disabled={isPaid}
                className={`w-full px-3 py-1.5 text-left text-xs ${
                  isPaid ? 'text-slate-300 cursor-not-allowed' : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
