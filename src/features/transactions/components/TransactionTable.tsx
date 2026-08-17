import {
  useTable,
  flexRender,
  createColumnHelper,
  stockFeatures,
  type ColumnDef,
} from '@tanstack/react-table';
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
}: TransactionTableProps) {
  const columns = [
    columnHelper.accessor('transactionDate', {
      header: 'Date',
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

        const isSaving = !categoryName || categoryName.trim() === '';
        const displayValue = isSaving ? 'Saving' : categoryName;
        const colorClass = isSaving ? 'text-blue-600 font-medium' : 'text-slate-700';

        return <span className={colorClass}>{displayValue}</span>;
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        return (
          <Badge
            variant={type === 'INCOME' ? 'outline' : 'secondary'}
            className={type === 'INCOME' ? 'text-green-600' : 'text-red-500'}
          >
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
        const categoryVal = info.row.original.categoryId;

        let categoryName = '';
        if (typeof categoryVal === 'object' && categoryVal !== null) {
          categoryName = categoryVal.name;
        } else if (categoryVal) {
          const found = categories.find((c) => c.id === categoryVal || c._id === categoryVal);
          categoryName = found ? found.name : String(categoryVal);
        }

        const isSaving = !categoryName || categoryName.trim() === '';

        let colorClass;
        let sign;

        if (isSaving) {
          colorClass = 'text-blue-600';
          sign = '';
        } else {
          colorClass = type === 'INCOME' ? 'text-green-600' : 'text-red-600';
          sign = type === 'INCOME' ? '+' : '-';
        }

        return (
          <span className={`font-medium ${colorClass}`}>
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
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Showing {transactions.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
          {Math.min(page * limit, totalRows)} of {totalRows} transactions
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
