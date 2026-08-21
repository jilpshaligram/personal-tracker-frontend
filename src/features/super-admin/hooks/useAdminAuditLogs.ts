import { useState, useEffect, useMemo } from 'react';
import { adminAuditLogService } from '../services/adminAuditLogService';
import { adminUserService } from '../services/adminUserService';
import type { AuditLogItem } from '../types/superAdmin';

export const useAdminAuditLogs = () => {
  const [rawLogs, setRawLogs] = useState<AuditLogItem[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminUserService.getUsers({ limit: 100 });
        const mapping: Record<string, string> = {};
        res.items.forEach((user) => {
          mapping[user.id] = user.email || user.name;
        });
        setUsersMap(mapping);
      } catch (err) {
        console.warn('Failed to load users for mapping:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  useEffect(() => {
    let active = true;
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await adminAuditLogService.getAuditLogs({
          page,
          limit,
          search: searchQuery.trim(),
        });
        if (active) {
          setRawLogs(res.items);
          setTotalRows(res.meta.total);
        }
      } catch (err) {
        console.error('Failed to fetch admin audit logs:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchLogs();
    return () => {
      active = false;
    };
  }, [page, limit, searchQuery]);

  const logs = useMemo(() => {
    return rawLogs.map((log) => ({
      ...log,
      actor: usersMap[log.actor] || log.actor || 'System',
    }));
  }, [rawLogs, usersMap]);

  return {
    logs,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery: handleSearchChange,
    totalRows,
  };
};
