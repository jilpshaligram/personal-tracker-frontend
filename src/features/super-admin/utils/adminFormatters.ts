import type { AdminBadgeTone } from '../components/common/AdminBadge';
import type { AdminUserStatus, AuditLogSeverity } from '../types/superAdmin';

export const getStatusTone = (status: AdminUserStatus): AdminBadgeTone => {
  switch (status) {
    case 'active':
      return 'teal';
    case 'suspended':
      return 'red';
    case 'inactive':
    default:
      return 'neutral';
  }
};

export const getSeverityTone = (severity: AuditLogSeverity): AdminBadgeTone => {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'warning':
      return 'amber';
    case 'success':
      return 'teal';
    case 'info':
    default:
      return 'indigo';
  }
};

export const formatAdminDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
