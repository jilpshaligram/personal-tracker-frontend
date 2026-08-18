import React from 'react';
import { AdminUsersTable, useAdminUsers } from '../../features/super-admin';

export const SuperAdminUsersPage: React.FC = () => {
  const { users } = useAdminUsers();

  return (
    <div className="p-5 sm:p-7 max-w-7xl mx-auto">
      <AdminUsersTable users={users} />
    </div>
  );
};

export default SuperAdminUsersPage;
