import { useState, useEffect } from 'react';
import { adminUserService } from '../services/adminUserService';
import type { AdminUser } from '../types/admin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await adminUserService.getUsers({
          page,
          limit,
          search: searchQuery.trim(),
        });
        if (active) {
          setUsers(res.items);
          setTotalRows(res.meta.total);
        }
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
    return () => {
      active = false;
    };
  }, [page, limit, searchQuery, refreshKey]);

  const deleteUser = async (id: string) => {
    await adminUserService.deleteUser(id);
    setRefreshKey((k) => k + 1);
  };

  return {
    users,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery: handleSearchChange,
    totalRows,
    deleteUser,
  };
};
