import React from 'react';
import type { AdminUserStatus, AuditLogSeverity } from '../../types/admin';

type StatusType = AdminUserStatus | AuditLogSeverity | 'healthy' | 'critical' | 'warning';

const STATUS_COLOR_MAP: Record<string, string> = {
  healthy: '#16A870',
  warning: '#D8930F',
  critical: '#E14C58',
  active: '#16A870',
  suspended: '#E14C58',
  inactive: '#9AA2B1',
  success: '#16A870',
  info: '#2F63EB',
};

interface AdminStatusDotProps {
  status: StatusType;
  size?: number;
}

export const AdminStatusDot: React.FC<AdminStatusDotProps> = ({ status, size = 7 }) => {
  const color = STATUS_COLOR_MAP[status] || '#9AA2B1';
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
};
