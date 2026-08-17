import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { UpcomingBill } from '../types';

interface BillsOverviewProps {
  bills: UpcomingBill[];
  loading: boolean;
}

export function BillsOverview({ bills, loading }: BillsOverviewProps) {
  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Upcoming Bills</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="text-slate-400">Loading upcoming bills...</div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto">
        {bills.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px] text-sm text-slate-500">
            No upcoming bills
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0 min-w-max gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-receipt"
                    >
                      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                      <path d="M12 17.5v-11" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{bill.title}</p>
                    <p className="text-sm text-slate-500">Due {formatDate(bill.dueDate)}</p>
                  </div>
                </div>
                <div className="font-semibold text-slate-900">{formatCurrency(bill.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
