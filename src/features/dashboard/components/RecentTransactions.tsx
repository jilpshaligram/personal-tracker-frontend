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
  const formatCurrency = (val: number, type: 'INCOME' | 'EXPENSE') => {
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
      val
    );
    return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
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
      <CardContent className="flex-1">
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
                <TableHead>Entity / Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium text-slate-900">{txn.entity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {txn.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{formatDate(txn.date)}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${txn.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}
                  >
                    {formatCurrency(txn.amount, txn.type)}
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
