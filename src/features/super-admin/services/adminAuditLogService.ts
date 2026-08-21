import { apiClient } from '../../../api/client';
import type { AuditLogItem, AuditLogSeverity, PaginationMeta } from '../types/superAdmin';

interface BackendAuditLog {
  id?: string;
  userId?: string;
  action?: string;
  module?: string;
  resource?: string;
  method?: string;
  endpoint?: string;
  ipAddress?: string;
  createdAt?: string;
}

export interface PaginatedAuditLogs {
  items: AuditLogItem[];
  meta: PaginationMeta;
}

export const adminAuditLogService = {
  getAuditLogs: async (params?: Record<string, unknown>): Promise<PaginatedAuditLogs> => {
    const { data } = await apiClient.get('/admin/audit-logs', { params });
    const rawItems: BackendAuditLog[] = data?.data ?? [];
    const meta: PaginationMeta = data?.meta ?? {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

    const items = rawItems.map((item) => {
      let severity: AuditLogSeverity = 'info';
      const action = String(item.action || '').toUpperCase();
      const method = String(item.method || '').toUpperCase();

      if (action.includes('DELETE') || method === 'DELETE') {
        severity = 'critical';
      } else if (
        action.includes('UPDATE') ||
        action.includes('PATCH') ||
        method === 'PATCH' ||
        method === 'PUT'
      ) {
        severity = 'warning';
      } else if (action.includes('CREATE') || action.includes('POST') || method === 'POST') {
        severity = 'success';
      }

      return {
        ts: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A',
        actor: item.userId || 'System',
        action: `${item.method || ''} ${item.action || ''}`.trim() || 'API Access',
        target: item.endpoint || item.resource || 'N/A',
        ip: item.ipAddress || '127.0.0.1',
        severity,
      };
    });

    return { items, meta };
  },
};
