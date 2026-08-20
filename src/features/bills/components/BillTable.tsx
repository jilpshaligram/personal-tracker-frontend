import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Repeat,
  MoreVertical,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
  Receipt,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { createColumnHelper, stockFeatures, type ColumnDef } from '@tanstack/react-table';
import { BillStatusBadge } from './BillStatusBadge';
import { DataTable } from '../../../components/ui/data-table';
import type { Bill, BillCategory, BillSortField, BillTableProps } from '../types';

export const BillTable: React.FC<BillTableProps> = ({
  bills,
  totalBills = 0,
  categories,
  isLoading,
  sortField,
  sortOrder = 'asc',
  onSort,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkAsPaid,
  onAddNew,
}) => {
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.bill-actions-dropdown') && !target.closest('.bill-menu-trigger-btn')) {
        setActiveMenu(null);
      }
    };

    const handleScrollOrResize = () => {
      setActiveMenu(null);
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [activeMenu]);

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>, billId: string) => {
    e.stopPropagation();
    if (activeMenu?.id === billId) {
      setActiveMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 120;
    const menuWidth = 144;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    const top = shouldOpenUpward ? rect.top - menuHeight - 4 : rect.bottom + 4;
    const left = Math.max(8, rect.right - menuWidth);

    setActiveMenu({
      id: billId,
      top,
      left,
    });
  };

  const getCategoryName = (categoryId: string, categoryObj?: BillCategory | string) => {
    if (typeof categoryObj === 'object' && categoryObj?.name) return categoryObj.name;
    const found = categories.find((c) => (c.id || c._id) === categoryId);
    return found ? found.name : 'General';
  };

  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  };

  const renderSortIcon = (field: BillSortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
      );
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  const columnHelper = createColumnHelper<typeof stockFeatures, Bill>();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('title', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('title')}
            >
              <span>Bill Title</span>
              {renderSortIcon('title')}
            </div>
          ),
          cell: (info) => {
            const bill = info.row.original;
            return (
              <div>
                <div className="font-semibold text-slate-900 text-sm">{bill.title}</div>
                {bill.notes && (
                  <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                    {bill.notes}
                  </div>
                )}
              </div>
            );
          },
        }),
        columnHelper.accessor('categoryId', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('category')}
            >
              <span>Category</span>
              {renderSortIcon('category')}
            </div>
          ),
          cell: (info) => (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              {getCategoryName(info.getValue(), info.row.original.category)}
            </span>
          ),
        }),
        columnHelper.accessor('dueDate', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('dueDate')}
            >
              <span>Due Date</span>
              {renderSortIcon('dueDate')}
            </div>
          ),
          cell: (info) => {
            const bill = info.row.original;
            return (
              <div>
                <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(info.getValue())}</span>
                </div>
                {bill.reminderDaysBefore ? (
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reminder: {bill.reminderDaysBefore}d before
                  </div>
                ) : null}
              </div>
            );
          },
          footer: () => (
            <div className="text-right text-sm text-slate-600 font-bold pr-2">Total Amount:</div>
          ),
        }),
        columnHelper.accessor('amount', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('amount')}
            >
              <span>Amount</span>
              {renderSortIcon('amount')}
            </div>
          ),
          cell: (info) => (
            <span className="font-bold text-slate-900 text-sm">
              {formatCurrency(info.getValue(), info.row.original.currency)}
            </span>
          ),
          footer: (info) => {
            const totalAmount = info.table
              .getRowModel()
              .rows.reduce((sum, row) => sum + row.original.amount, 0);
            return (
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(
                  totalAmount,
                  info.table.getRowModel().rows[0]?.original.currency || 'INR'
                )}
              </span>
            );
          },
        }),
        columnHelper.accessor('status', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('status')}
            >
              <span>Status</span>
              {renderSortIcon('status')}
            </div>
          ),
          cell: (info) => <BillStatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor('isRecurring', {
          header: () => (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => onSort?.('recurring')}
            >
              <span>Recurrence</span>
              {renderSortIcon('recurring')}
            </div>
          ),
          cell: (info) => {
            const bill = info.row.original;
            const isRecurring =
              bill.isRecurring === true || (bill.isRecurring as unknown) === 'true';
            return isRecurring ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
                <Repeat className="w-3.5 h-3.5" />
                {bill.recurringType || 'MONTHLY'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 border border-violet-200/60">
                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                One-time
              </span>
            );
          },
        }),
        columnHelper.display({
          id: 'actions',
          header: () => <div className="text-right w-full block">Actions</div>,
          cell: (info) => {
            const bill = info.row.original;
            const id = bill.id || bill._id || '';
            const isPaid = bill.status?.toUpperCase() === 'PAID';

            return (
              <div className="flex items-center justify-end gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => !isPaid && onMarkAsPaid(bill)}
                  disabled={isPaid}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md shadow-xs transition-colors ${
                    isPaid
                      ? 'bg-emerald-50 text-emerald-400 cursor-not-allowed border border-emerald-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  title={isPaid ? 'Already paid' : 'Mark as paid'}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isPaid ? 'Paid' : 'Pay'}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleToggleMenu(e, id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors bill-menu-trigger-btn"
                  aria-label={`Options for ${bill.title}`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          },
        }),
      ] as unknown as ColumnDef<typeof stockFeatures, Bill, unknown>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortField, sortOrder, categories]
  );

  const emptyState = (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 shadow-xs p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <Receipt className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">No bills found</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-5">
        Get started by adding your recurring or one-time utility and subscription bills, or clear
        your search filters.
      </p>
      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
      >
        Add Your First Bill
      </button>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={bills}
        isLoading={isLoading}
        emptyState={emptyState}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalBills}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {activeMenu && (
        <div
          className="fixed w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-left animate-in fade-in zoom-in-95 duration-100 bill-actions-dropdown"
          style={{
            top: `${activeMenu.top}px`,
            left: `${activeMenu.left}px`,
          }}
        >
          {(() => {
            const activeBill = bills.find((b) => (b.id || b._id) === activeMenu.id);
            if (!activeBill) return null;
            const isPaid = activeBill.status === 'PAID';

            return (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    onViewDetails(activeBill);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isPaid) return;
                    setActiveMenu(null);
                    onEdit(activeBill);
                  }}
                  disabled={isPaid}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    isPaid
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Bill
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    if (isPaid) return;
                    setActiveMenu(null);
                    onDelete(activeBill);
                  }}
                  disabled={isPaid}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    isPaid ? 'text-slate-300 cursor-not-allowed' : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
};
