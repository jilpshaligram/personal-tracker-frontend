import { useState, useEffect } from 'react';
import { superAdminService } from '../services/superAdminService';
import type { AuditLogItem } from '../types/superAdmin';

export const useAdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await superAdminService.getAuditLogs();
        setLogs(res);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return {
    logs,
    isLoading,
  };
};
