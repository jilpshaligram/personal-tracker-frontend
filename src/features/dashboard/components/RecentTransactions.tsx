import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import type { RecentTransaction } from '../types';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  loading: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  const getTransactionStyles = (type: string) => {
    switch (type) {
      case 'INCOME':
      case 'OPENING_BALANCE':
      case 'TRANSFER_FROM_SAVING':
        return { sign: '+', colorClass: 'text-emerald-600' };
      case 'TRANSFER_TO_SAVING':
        return { sign: '-', colorClass: 'text-blue-600' };
      case 'EXPENSE':
      default:
        return { sign: '-', colorClass: 'text-red-500' };
    }
  };

  const formatCurrency = (val: number, sign: string) => {
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
      val
    );
    return `${sign}${formatted}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px] text-slate-400">
            Loading recent transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px] text-sm text-slate-500">
            No recent transactions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Entity / Description</TableHead>
                <TableHead className="whitespace-nowrap">Category</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                    {txn.entity}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant="secondary" className="font-normal">
                      {txn.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {formatDate(txn.date)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold whitespace-nowrap ${getTransactionStyles(txn.type).colorClass}`}
                  >
                    {formatCurrency(txn.amount, getTransactionStyles(txn.type).sign)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
