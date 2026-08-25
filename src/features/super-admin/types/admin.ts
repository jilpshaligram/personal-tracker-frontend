export type AdminUserStatus = 'active' | 'suspended' | 'inactive';
export type AdminUserPlan = 'Free' | 'Pro' | 'Enterprise';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  plan: AdminUserPlan;
  joined: string;
  lastSeen: string;
}

export type AuditLogSeverity = 'critical' | 'warning' | 'success' | 'info';

export interface AuditLogItem {
  ts: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  severity: AuditLogSeverity;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
