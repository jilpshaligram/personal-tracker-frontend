import {
  useTable,
  flexRender,
  createColumnHelper,
  stockFeatures,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
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
}: TransactionTableProps) {
  const columns = [
    columnHelper.accessor('transactionDate', {
      header: () => {
        const isSorted = currentSort?.field === 'transactionDate';
        const isDesc = currentSort?.order === 'desc';

        return (
          <button
            className="flex items-center gap-1 font-medium hover:text-slate-900 transition-colors"
            onClick={() => {
              if (onSortChange) {
                if (isSorted) {
                  onSortChange('transactionDate', isDesc ? 'asc' : 'desc');
                } else {
                  onSortChange('transactionDate', 'desc');
                }
              }
            }}
          >
            Date
            {isSorted &&
              (isDesc ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
          </button>
        );
      },
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('categoryId', {
      header: 'Category',
      cell: (info) => {
        const val = info.getValue();

        let categoryName = '';
        if (typeof val === 'object' && val !== null) {
          categoryName = val.name;
        } else if (val) {
          const found = categories.find((c) => c.id === val || c._id === val);
          categoryName = found ? found.name : String(val);
        }

        const displayValue =
          !categoryName || categoryName.trim() === '' ? 'Uncategorized' : categoryName;
        return <span className="text-slate-600">{displayValue}</span>;
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        let Icon = ArrowRightLeft;
        let colorClass = 'bg-slate-100 text-slate-700';

        if (type === 'INCOME') {
          Icon = ArrowDownCircle;
          colorClass = 'bg-green-100 text-green-700';
        } else if (type === 'EXPENSE') {
          Icon = ArrowUpCircle;
          colorClass = 'bg-red-100 text-red-700';
        }

        return (
          <Badge variant="secondary" className={`flex w-fit items-center gap-1.5 ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
            {type}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('paymentMethod', {
      header: 'Method',
      cell: (info) => {
        const val = info.getValue();
        return typeof val === 'string' ? val.replace('_', ' ') : '-';
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => {
        const amount = info.getValue();
        const type = info.row.original.type;

        let colorClass = 'text-slate-600';
        let sign = '';

        if (type === 'INCOME') {
          colorClass = 'text-green-600';
          sign = '+';
        } else if (type === 'EXPENSE') {
          colorClass = 'text-red-600';
          sign = '-';
        }

        return (
          <span className={`font-semibold ${colorClass} text-right block pr-4`}>
            {sign}₹{amount.toFixed(2)}
          </span>
        );
      },
    }),
  ];

  const table = useTable({
    features: stockFeatures,
    data: transactions,
    columns: columns as unknown as ColumnDef<typeof stockFeatures, Transaction, unknown>[],
    manualPagination: true,
    pageCount: Math.ceil(totalRows / limit),
  });

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-white overflow-hidden [&>div]:max-h-[600px]">
        <Table>
          <TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap uppercase tracking-wider text-slate-500 text-xs font-semibold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500 h-24">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500 h-24">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="border border-slate-200 rounded-md text-sm py-1 px-2 bg-white"
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {transactions.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
            {Math.min(page * limit, totalRows)} of {totalRows} transactions
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
