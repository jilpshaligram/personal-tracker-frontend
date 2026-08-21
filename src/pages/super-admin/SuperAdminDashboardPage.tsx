import React from 'react';
import { Users } from 'lucide-react';
import { AdminViewHeader, AdminStatCard, useSuperAdminDashboard } from '../../features/super-admin';

export const SuperAdminDashboardPage: React.FC = () => {
  const { totalUsers } = useSuperAdminDashboard();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto space-y-4">
      <AdminViewHeader
        title="Dashboard"
        subtitle="Welcome back — here's an overview of the system."
      />

      <div className="max-w-md">
        <AdminStatCard
          label="Total users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          sub="Across all plans"
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
