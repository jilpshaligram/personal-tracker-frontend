import React from 'react';
import { AdminAuditLogsTable, useAdminAuditLogs } from '../../features/super-admin';

export const SuperAdminAuditLogsPage: React.FC = () => {
  const { logs } = useAdminAuditLogs();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto">
      <AdminAuditLogsTable logs={logs} />
    </div>
  );
};

export default SuperAdminAuditLogsPage;
