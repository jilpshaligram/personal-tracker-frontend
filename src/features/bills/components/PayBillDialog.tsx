import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, DollarSign, FileText } from 'lucide-react';
import { useBillHistory } from '../history/useBillHistory';
import type { PayBillDialogProps, PayBillPayload, PaymentMethod } from '../types';

export const PayBillDialog: React.FC<PayBillDialogProps> = ({
  bill,
  defaultAmount,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  const {
    totalPaid,
    remainingAmount: historyRemaining,
    isPartiallyPaid,
  } = useBillHistory(bill, isOpen);

  const [userInputAmount, setUserInputAmount] = useState<number | '' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [notes, setNotes] = useState('');
  const [remarks, setRemarks] = useState('');
  const [payError, setPayError] = useState<string | null>(null);

  const [prevDialogKey, setPrevDialogKey] = useState<string | null>(null);
  const currentKey = bill && isOpen ? `${bill.id || bill._id}_${defaultAmount}` : null;

  if (currentKey !== prevDialogKey) {
    setPrevDialogKey(currentKey);
    setUserInputAmount(null);
    setPaymentMethod('CARD');
    setNotes('');
    setRemarks('');
    setPayError(null);
  }

  if (!isOpen || !bill) return null;

  const effectiveRemaining =
    defaultAmount !== undefined && defaultAmount > 0
      ? defaultAmount
      : historyRemaining > 0 && historyRemaining < bill.amount
        ? historyRemaining
        : bill.amount || 0;

  const isPartial =
    isPartiallyPaid ||
    (defaultAmount !== undefined && defaultAmount > 0 && defaultAmount < bill.amount) ||
    (historyRemaining > 0 && historyRemaining < bill.amount);

  const currentDisplayAmount =
    userInputAmount !== null ? userInputAmount : effectiveRemaining > 0 ? effectiveRemaining : '';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayError(null);
    const id = bill.id || bill._id || '';
    const numAmount =
      userInputAmount !== null && userInputAmount !== ''
        ? Number(userInputAmount)
        : effectiveRemaining;

    if (numAmount <= 0) {
      setPayError('Please enter a valid payment amount greater than zero.');
      return;
    }

    const payload: PayBillPayload = {
      amountPaid: numAmount,
      paymentMethod,
      notes: notes.trim() || undefined,
      remarks: remarks.trim() || notes.trim() || undefined,
      createTransaction: true,
    };

    try {
      await onConfirm(id, payload);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setPayError(e?.message || 'Payment recording failed. Please try again.');
    }
  };

  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Record Bill Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {payError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed">
            {payError}
          </div>
        )}

        <form onSubmit={handlePay} noValidate className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-600 font-medium">Paying for</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{bill.title}</div>
              {isPartial && (
                <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  Paying Remaining Balance
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-600 font-medium">
                {isPartial ? 'Remaining Balance' : 'Total Bill'}
              </span>
              <div className="font-bold text-emerald-700 text-base">
                {formatCurrency(effectiveRemaining, bill.currency)}
              </div>
              {isPartial && totalPaid > 0 && (
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Paid: {formatCurrency(totalPaid, bill.currency)}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Amount Paid <span className="text-rose-500">*</span>
              </label>
              {isPartial && (
                <button
                  type="button"
                  onClick={() => setUserInputAmount(effectiveRemaining)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Fill Remaining ({formatCurrency(effectiveRemaining, bill.currency)})
                </button>
              )}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={currentDisplayAmount}
                onChange={(e) =>
                  setUserInputAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="CARD">CARD (Credit / Debit Card)</option>
                <option value="UPI">UPI / Instant Transfer</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER (NEFT / IMPS)</option>
                <option value="NET_BANKING">NET_BANKING</option>
                <option value="CASH">CASH</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid via mobile banking"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Reference No / Transaction ID"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : 'Pay Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
