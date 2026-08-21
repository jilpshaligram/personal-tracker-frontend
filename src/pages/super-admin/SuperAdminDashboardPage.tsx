import React from 'react';
import { Users, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import {
  AdminViewHeader,
  SegmentedControl,
  AdminStatCard,
  AdminGrowthChart,
  AdminLatencyChart,
  AdminAlertsCard,
  AdminRecentActivityCard,
  AdminIncidentsCard,
  useSuperAdminDashboard,
} from '../../features/super-admin';

export const SuperAdminDashboardPage: React.FC = () => {
  const { range, setRange, growth, latency, alerts, recentLogs, incidents } =
    useSuperAdminDashboard();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto space-y-4">
      <AdminViewHeader
        title="Dashboard"
        subtitle="Welcome back — here's an overview of the system."
        right={
          <SegmentedControl
            options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            value={range}
            onChange={setRange}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <AdminStatCard label="Total users" value="1,284" icon={Users} sub="Across all plans" />
        <AdminStatCard
          label="Active today"
          value="947"
          icon={TrendingUp}
          iconTone="#16A870"
          sub="Daily active users"
        />
        <AdminStatCard
          label="System uptime"
          value="99.97%"
          icon={Activity}
          iconTone="#16A870"
          sub="Rolling 30 days"
        />
        <AdminStatCard
          label="Open alerts"
          value="1"
          icon={AlertTriangle}
          iconTone="#D8930F"
          sub="Since yesterday"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <div className="lg:col-span-2">
          <AdminGrowthChart data={growth} currentCount={947} />
        </div>
        <div className="lg:col-span-1">
          <AdminAlertsCard alerts={alerts} />
        </div>
      </div>

      <AdminLatencyChart data={latency} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <div className="lg:col-span-2">
          <AdminRecentActivityCard logs={recentLogs} />
        </div>
        <div className="lg:col-span-1">
          <AdminIncidentsCard incidents={incidents} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
