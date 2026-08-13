import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import type { DocumentAlert } from '../types';

interface DocumentOverviewProps {
  alerts: DocumentAlert[];
  loading: boolean;
}

export function DocumentOverview({ alerts, loading }: DocumentOverviewProps) {
  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Document Vault Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[150px]">
          <div className="text-slate-400">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Document Vault Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[150px] text-sm text-slate-500">
            No document expiry alerts
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{alert.title}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {alert.status === 'EXPIRED'
                      ? 'Expired'
                      : `Expires in ${alert.daysRemaining} days`}
                  </p>
                </div>
                <Badge variant={alert.status === 'EXPIRED' ? 'destructive' : 'warning'}>
                  {alert.status === 'EXPIRED' ? 'EXPIRED' : 'EXPIRING SOON'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
