import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Tag,
  Repeat,
  Bell,
  FileText,
  CheckCircle,
  CreditCard,
  History,
  Info,
  Eye,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { BillStatusBadge } from './BillStatusBadge';
import { BillHistoryDetails } from '../history/BillHistoryDetails';
import { useBillHistory } from '../history/useBillHistory';
import { billService } from '../services/billService';
import type { Bill, BillDetailsProps } from '../types';

export const BillDetails: React.FC<BillDetailsProps> = ({
  bill,
  categories,
  isOpen,
  onClose,
  onPay,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [detailedBill, setDetailedBill] = useState<Bill | null>(null);
  const [prevBillId, setPrevBillId] = useState<string | null>(null);

  const currentId = bill && isOpen ? bill.id || bill._id || null : null;
  if (currentId !== prevBillId) {
    setPrevBillId(currentId);
    setDetailedBill(null);
  }

  useEffect(() => {
    let active = true;
    if (bill && isOpen) {
      const id = bill.id || bill._id;
      if (id) {
        billService
          .getBillById(id)
          .then((res) => {
            if (active && res) setDetailedBill(res);
          })
          .catch(() => {});
      }
    }
    return () => {
      active = false;
    };
  }, [bill, isOpen]);

  const effectiveBill = detailedBill || bill;

  const {
    history,
    isLoading: isLoadingHistory,
    totalPaid,
    remainingAmount,
    isPartiallyPaid,
    isFullyPaid,
    paidPercentage,
  } = useBillHistory(effectiveBill, isOpen);

  if (!isOpen || !bill) return null;

  const rawAttachment =
    effectiveBill?.attachmentUrl ||
    effectiveBill?.attachment ||
    effectiveBill?.fileUrl ||
    effectiveBill?.file ||
    effectiveBill?.documentUrl ||
    effectiveBill?.document ||
    effectiveBill?.receiptUrl ||
    effectiveBill?.receipt;

  const attachmentUrl =
    typeof rawAttachment === 'string' && rawAttachment.trim() !== '' ? rawAttachment.trim() : null;

  const getCategoryName = () => {
    if (typeof bill.category === 'object' && bill.category?.name) return bill.category.name;
    const found = categories.find((c) => (c.id || c._id) === bill.categoryId);
    return found ? found.name : 'General';
  };

  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
    }).format(d);
  };

  const isImageAttachment = (url: string) => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return (
      cleanUrl.endsWith('.jpg') ||
      cleanUrl.endsWith('.jpeg') ||
      cleanUrl.endsWith('.png') ||
      cleanUrl.endsWith('.webp') ||
      cleanUrl.endsWith('.gif') ||
      cleanUrl.endsWith('.svg') ||
      cleanUrl.startsWith('data:image/')
    );
  };

  const isPdfAttachment = (url: string) => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return cleanUrl.endsWith('.pdf') || cleanUrl.startsWith('data:application/pdf');
  };

  const computedStatus = isFullyPaid ? 'PAID' : isPartiallyPaid ? 'PARTIALLY_PAID' : bill.status;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-800">Bill Details</h2>
              <BillStatusBadge status={computedStatus} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center px-6 pt-3 border-b border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Info className="w-4 h-4" />
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`inline-flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="w-4 h-4" />
              Payment History
              {history.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
            {activeTab === 'overview' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Bill Title</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{bill.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium">Total Amount</span>
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(bill.amount, bill.currency)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-slate-200/70">
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[11px] text-emerald-700 font-medium">Amount Paid</span>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">
                        {formatCurrency(totalPaid, bill.currency)}
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-lg border ${
                        remainingAmount > 0
                          ? isPartiallyPaid
                            ? 'bg-amber-50/70 border-amber-200'
                            : 'bg-rose-50/60 border-rose-200'
                          : 'bg-slate-100/60 border-slate-200'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-medium ${
                          remainingAmount > 0
                            ? isPartiallyPaid
                              ? 'text-amber-700'
                              : 'text-rose-700'
                            : 'text-slate-500'
                        }`}
                      >
                        Remaining to Pay
                      </span>
                      <div
                        className={`text-sm font-bold mt-0.5 ${
                          remainingAmount > 0
                            ? isPartiallyPaid
                              ? 'text-amber-800'
                              : 'text-rose-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {formatCurrency(remainingAmount, bill.currency)}
                      </div>
                    </div>
                  </div>

                  {(isPartiallyPaid || (totalPaid > 0 && remainingAmount > 0)) && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Paid {paidPercentage}%</span>
                        <span className="font-medium text-amber-700">
                          {formatCurrency(remainingAmount, bill.currency)} remaining
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${paidPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Tag className="w-4 h-4 text-slate-400" /> Category
                    </span>
                    <span className="font-medium text-slate-800">{getCategoryName()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" /> Due Date
                    </span>
                    <span className="font-medium text-slate-800">{formatDate(bill.dueDate)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Repeat className="w-4 h-4 text-slate-400" /> Recurrence
                    </span>
                    <span className="font-medium text-slate-800">
                      {bill.isRecurring === true || (bill.isRecurring as unknown) === 'true' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
                          <Repeat className="w-3.5 h-3.5" />
                          {bill.recurringType || 'MONTHLY'} (Recurring)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 border border-violet-200/60">
                          <Calendar className="w-3.5 h-3.5 text-violet-500" />
                          One-time bill
                        </span>
                      )}
                    </span>
                  </div>

                  {bill.reminderDaysBefore !== undefined && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Bell className="w-4 h-4 text-slate-400" /> Reminder
                      </span>
                      <span className="font-medium text-slate-800">
                        {bill.reminderDaysBefore} days before due date
                      </span>
                    </div>
                  )}

                  {bill.notes && (
                    <div className="pt-2">
                      <span className="flex items-center gap-2 text-slate-500 mb-1">
                        <FileText className="w-4 h-4 text-slate-400" /> Notes
                      </span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs leading-relaxed">
                        {bill.notes}
                      </p>
                    </div>
                  )}

                  {attachmentUrl && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex items-center gap-2 text-slate-500 font-medium">
                        <Paperclip className="w-4 h-4 text-slate-400" /> Attachment Document
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAttachmentModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/80 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
                        title="View Attachment"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Attachment</span>
                      </button>
                    </div>
                  )}

                  {isFullyPaid && bill.paidDate && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-4 h-4" /> Paid Date
                      </span>
                      <span className="font-medium text-slate-800">
                        {formatDate(bill.paidDate)}
                      </span>
                    </div>
                  )}
                </div>

                {history.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        Recent Payment Transactions
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View All ({history.length})
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {history.slice(0, 2).map((item, idx) => (
                        <div
                          key={item.id || item._id || idx}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium text-slate-800">
                              {formatCurrency(item.amountPaid, bill.currency)} via{' '}
                              {item.paymentMethod || 'CARD'}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            {item.paymentDate ? item.paymentDate.split('T')[0] : '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <BillHistoryDetails
                billAmount={bill.amount}
                currency={bill.currency}
                history={history}
                isLoading={isLoadingHistory}
                totalPaid={totalPaid}
                remainingAmount={remainingAmount}
                isPartiallyPaid={isPartiallyPaid}
                isFullyPaid={isFullyPaid}
                paidPercentage={paidPercentage}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="text-xs text-slate-500">
              {remainingAmount > 0 ? (
                <span>
                  Outstanding:{' '}
                  <strong className={isPartiallyPaid ? 'text-amber-700' : 'text-slate-800'}>
                    {formatCurrency(remainingAmount, bill.currency)}
                  </strong>
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Fully Settled
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              {!isFullyPaid && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPay(bill, remainingAmount > 0 ? remainingAmount : bill.amount);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isPartiallyPaid
                    ? `Pay Remaining (${formatCurrency(remainingAmount, bill.currency)})`
                    : 'Mark as Paid'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAttachmentModal && attachmentUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Attachment: {bill.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/80 transition-colors shadow-2xs"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-100/70 overflow-auto flex-1 flex items-center justify-center min-h-[300px]">
              {isImageAttachment(attachmentUrl) ? (
                <img
                  src={attachmentUrl}
                  alt={`Attachment for ${bill.title}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xs"
                />
              ) : isPdfAttachment(attachmentUrl) ? (
                <iframe
                  src={attachmentUrl}
                  title={`Document preview for ${bill.title}`}
                  className="w-full h-[70vh] rounded-lg border border-slate-200 bg-white"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Document Attachment</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Click below to open and view the document in a new tab.
                  </p>
                  <div className="flex items-center justify-center">
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
