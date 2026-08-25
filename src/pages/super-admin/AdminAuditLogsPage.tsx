import React from 'react';
import { AdminAuditLogsTable, useAdminAuditLogs } from '../../features/super-admin';

export const AdminAuditLogsPage: React.FC = () => {
  const {
    logs,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    totalRows,
  } = useAdminAuditLogs();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto">
      <AdminAuditLogsTable
        logs={logs}
        loading={isLoading}
        page={page}
        limit={limit}
        totalRows={totalRows}
        onPageChange={setPage}
        onLimitChange={setLimit}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default AdminAuditLogsPage;
