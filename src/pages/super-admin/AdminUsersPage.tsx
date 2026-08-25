import React from 'react';
import { AdminUsersTable, useAdminUsers } from '../../features/super-admin';

export const AdminUsersPage: React.FC = () => {
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
    deleteUser,
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
        onDeleteUser={deleteUser}
      />
    </div>
  );
};

export default AdminUsersPage;
