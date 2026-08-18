import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BillStatusBadge } from './BillStatusBadge';
import type { BillCategory, BillSortField, BillTableProps } from '../types';

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading your bills...</p>
      </div>
    );
  }

  if (totalBills === 0 && bills.length === 0) {
    return (
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
  }

  const startRecordIndex = totalBills > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecordIndex = Math.min(currentPage * pageSize, totalBills);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between ${
        bills.length < 5 ? 'min-h-[400px]' : ''
      }`}
    >
      <div className={`overflow-x-auto ${bills.length < 5 ? 'min-h-[320px]' : ''}`}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 select-none">
              <th
                onClick={() => onSort?.('title')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Bill Title</span>
                  {renderSortIcon('title')}
                </div>
              </th>

              <th
                onClick={() => onSort?.('category')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  {renderSortIcon('category')}
                </div>
              </th>

              <th
                onClick={() => onSort?.('dueDate')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Due Date</span>
                  {renderSortIcon('dueDate')}
                </div>
              </th>

              <th
                onClick={() => onSort?.('amount')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Amount</span>
                  {renderSortIcon('amount')}
                </div>
              </th>

              <th
                onClick={() => onSort?.('status')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              <th
                onClick={() => onSort?.('recurring')}
                className="px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Recurrence</span>
                  {renderSortIcon('recurring')}
                </div>
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill) => {
              const id = bill.id || bill._id || '';
              const isPaid = bill.status?.toUpperCase() === 'PAID';

              return (
                <tr key={id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 text-sm">{bill.title}</div>
                    {bill.description && (
                      <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                        {bill.description}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {getCategoryName(bill.categoryId, bill.category)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(bill.dueDate)}</span>
                    </div>
                    {bill.reminderDaysBefore ? (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Reminder: {bill.reminderDaysBefore}d before
                      </div>
                    ) : null}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                    {formatCurrency(bill.amount, bill.currency)}
                  </td>

                  <td className="px-5 py-4">
                    <BillStatusBadge status={bill.status} />
                  </td>

                  <td className="px-5 py-4">
                    {bill.isRecurring ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Repeat className="w-3 h-3" />
                        {bill.recurringType || 'MONTHLY'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">One-time</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => onMarkAsPaid(bill)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                          title="Mark as paid"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Pay
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleToggleMenu(e, id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors bill-menu-trigger-btn"
                        aria-label={`Options for ${bill.title}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                    setActiveMenu(null);
                    onEdit(activeBill);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  Edit Bill
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    onDelete(activeBill);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete
                </button>
              </>
            );
          })()}
        </div>
      )}

      {totalBills > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 rounded-b-xl text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              Showing <span className="font-semibold text-slate-800">{startRecordIndex}</span> to{' '}
              <span className="font-semibold text-slate-800">{endRecordIndex}</span> of{' '}
              <span className="font-semibold text-slate-800">{totalBills}</span> bills
            </span>

            {onPageSizeChange && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 text-xs font-medium rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                  aria-label="Rows per page"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {getPageNumbers().map((page, idx) => {
                if (typeof page === 'string') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400">
                      ...
                    </span>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <button
                    key={`page-${page}`}
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`min-w-[28px] h-7 px-2 text-xs font-semibold rounded transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
