import { createColumnHelper, stockFeatures, type ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { DataTable } from '../../../components/ui/data-table';
import type { Transaction, TransactionCategory } from '../types/transaction.types';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  page: number;
  limit: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  categories?: TransactionCategory[];
  currentSort?: { field: string; order: 'asc' | 'desc' };
  onSortChange?: (field: string, order: 'asc' | 'desc') => void;
  onLimitChange?: (limit: number) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const columnHelper = createColumnHelper<typeof stockFeatures, Transaction>();

export function TransactionTable({
  transactions,
  loading,
  page,
  limit,
  totalRows,
  onPageChange,
  categories = [],
  currentSort,
  onSortChange,
  onLimitChange,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const renderSortableHeader = (field: string, label: string, alignRight = false) => {
    const isSorted = currentSort?.field === field;
    const isDesc = currentSort?.order === 'desc';
    return (
      <div
        className={`flex items-center gap-1.5 cursor-pointer group hover:text-slate-900 transition-colors ${alignRight ? 'justify-end w-full pr-4' : ''}`}
        onClick={() => {
          if (onSortChange) {
            if (isSorted) {
              onSortChange(field, isDesc ? 'asc' : 'desc');
            } else {
              onSortChange(field, 'desc');
            }
          }
        }}
      >
        <span className="font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
        {isSorted ? (
          isDesc ? (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        )}
      </div>
    );
  };

  const columns = [
    columnHelper.accessor('transactionDate', {
      header: () => renderSortableHeader('transactionDate', 'Date'),
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {new Date(info.getValue()).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: () => renderSortableHeader('description', 'Description'),
      cell: (info) => (
        <div className="font-semibold text-slate-900 text-sm">{info.getValue() || '-'}</div>
      ),
    }),
    columnHelper.accessor('categoryId', {
      header: () => renderSortableHeader('categoryId', 'Category'),
      cell: (info) => {
        const val = info.getValue();
        const savingGoal = info.row.original.savingGoalId;

        let categoryName = '';
        if (typeof val === 'object' && val !== null) {
          categoryName = (val as { name?: string }).name || '';
        } else if (val) {
          const found = categories.find((c) => c.id === val || (c as { _id?: string })._id === val);
          categoryName = found ? found.name : String(val);
        }

        if (!categoryName || categoryName.trim() === '') {
          if (info.row.original.type === 'OPENING_BALANCE') {
            categoryName = 'Wallet Balance';
          } else if (typeof savingGoal === 'object' && savingGoal !== null) {
            categoryName =
              (savingGoal as { name?: string; title?: string }).name ||
              (savingGoal as { title?: string }).title ||
              '';
          } else if (typeof savingGoal === 'string' && savingGoal.trim() !== '') {
            categoryName = 'Savings Transfer';
          }
        }

        const displayValue =
          !categoryName || categoryName.trim() === '' ? 'Uncategorized' : categoryName;
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {displayValue}
          </span>
        );
      },
    }),
    columnHelper.accessor('type', {
      header: () => renderSortableHeader('type', 'Type'),
      cell: (info) => {
        const type = info.getValue();
        let Icon = ArrowRightLeft;
        let colorClass = 'bg-slate-100 text-slate-700';

        if (type === 'INCOME' || type === 'OPENING_BALANCE') {
          Icon = ArrowDownCircle;
          colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
        } else if (type === 'EXPENSE') {
          Icon = ArrowUpCircle;
          colorClass = 'bg-rose-50 text-rose-700 border-rose-200/60';
        } else if (type === 'TRANSFER_TO_SAVING' || type === 'TRANSFER_FROM_SAVING') {
          Icon = ArrowRightLeft;
          colorClass = 'bg-blue-50 text-blue-700 border-blue-200/60';
        }

        return (
          <Badge
            variant="secondary"
            className={`flex w-fit items-center gap-1.5 border ${colorClass} px-2.5 py-0.5 text-xs font-semibold rounded-full`}
          >
            <Icon className="h-3.5 w-3.5" />
            {type}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('paymentMethod', {
      header: () => renderSortableHeader('paymentMethod', 'Method'),
      cell: (info) => {
        const val = info.getValue();
        return typeof val === 'string' ? (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600">{val.replace('_', ' ')}</span>
          </div>
        ) : (
          '-'
        );
      },
      footer: () => (
        <div className="text-right text-sm text-slate-600 font-bold pr-2">Page Total:</div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: () => renderSortableHeader('amount', 'Amount', true),
      cell: (info) => {
        const amount = info.getValue();
        const type = info.row.original.type;

        let colorClass = 'text-slate-900';
        let sign = '';

        if (type === 'INCOME' || type === 'OPENING_BALANCE') {
          colorClass = 'text-emerald-600';
          sign = '+';
        } else if (type === 'EXPENSE') {
          colorClass = 'text-rose-600';
          sign = '-';
        } else if (type === 'TRANSFER_TO_SAVING' || type === 'TRANSFER_FROM_SAVING') {
          colorClass = 'text-blue-600';
        }

        return (
          <span className={`font-bold ${colorClass} text-sm text-right block pr-4`}>
            {sign}
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 2,
            }).format(amount)}
          </span>
        );
      },
      footer: (info) => {
        const totalAmount = info.table.getRowModel().rows.reduce((sum, row) => {
          const type = row.original.type;
          const amount = row.original.amount;
          if (type === 'INCOME' || type === 'OPENING_BALANCE') return sum + amount;
          if (type === 'EXPENSE') return sum - amount;
          return sum;
        }, 0);

        const isPositive = totalAmount >= 0;
        const colorClass =
          totalAmount === 0 ? 'text-slate-600' : isPositive ? 'text-emerald-600' : 'text-rose-600';
        const sign = totalAmount < 0 ? '-' : totalAmount > 0 ? '+' : '';

        return (
          <span className={`font-bold ${colorClass} text-sm text-right block pr-4`}>
            {sign}
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 2,
            }).format(Math.abs(totalAmount))}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right pr-4">Actions</div>,
      cell: (info) => {
        const isSystemGenerated = !!info.row.original.savingGoalId || !!info.row.original.billId;

        return (
          <div className="flex items-center justify-end gap-2 pr-4">
            <button
              type="button"
              onClick={() => !isSystemGenerated && onEdit && onEdit(info.row.original)}
              disabled={isSystemGenerated}
              className={`p-1.5 rounded-lg transition-colors ${
                isSystemGenerated
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
              }`}
              title={
                isSystemGenerated
                  ? 'System generated transaction cannot be edited'
                  : 'Edit Transaction'
              }
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => !isSystemGenerated && onDelete && onDelete(info.row.original)}
              disabled={isSystemGenerated}
              className={`p-1.5 rounded-lg transition-colors ${
                isSystemGenerated
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
              }`}
              title={
                isSystemGenerated
                  ? 'System generated transaction cannot be deleted'
                  : 'Delete Transaction'
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <DataTable
      columns={columns as unknown as ColumnDef<typeof stockFeatures, Transaction, unknown>[]}
      data={transactions}
      isLoading={loading}
      currentPage={page}
      pageSize={limit}
      totalPages={totalPages}
      totalRecords={totalRows}
      onPageChange={onPageChange}
      onPageSizeChange={onLimitChange}
    />
  );
}
