import React from 'react';
import { AdminUsersTable, useAdminUsers } from '../../features/super-admin';

export const SuperAdminUsersPage: React.FC = () => {
  const {
    users,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    totalRows,
  } = useAdminUsers();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto">
      <AdminUsersTable
        users={users}
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

export default SuperAdminUsersPage;
