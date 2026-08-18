import { useState, useEffect, useMemo } from 'react';
import { superAdminService } from '../services/superAdminService';
import type { AdminUser } from '../types/superAdmin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await superAdminService.getUsers();
        setUsers(res);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return {
    users: filteredUsers,
    totalCount: users.length,
    searchQuery,
    setSearchQuery,
    isLoading,
  };
};
