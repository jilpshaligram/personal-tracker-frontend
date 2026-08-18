import type {
  AdminUser,
  AlertItem,
  AuditLogItem,
  GrowthDataPoint,
  IncidentItem,
  LatencyDataPoint,
} from '../types/superAdmin';

export const growthData: GrowthDataPoint[] = [
  { d: 'Mon', users: 812 },
  { d: 'Tue', users: 840 },
  { d: 'Wed', users: 861 },
  { d: 'Thu', users: 855 },
  { d: 'Fri', users: 902 },
  { d: 'Sat', users: 918 },
  { d: 'Sun', users: 947 },
];

export const latencyData: LatencyDataPoint[] = [
  { t: '00:00', ms: 82 },
  { t: '04:00', ms: 76 },
  { t: '08:00', ms: 121 },
  { t: '12:00', ms: 145 },
  { t: '16:00', ms: 110 },
  { t: '20:00', ms: 90 },
  { t: '23:59', ms: 84 },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr_9F21',
    name: 'Priya Nair',
    email: 'priya.nair@mail.com',
    status: 'active',
    plan: 'Pro',
    joined: '2025-11-02',
    lastSeen: '2m ago',
  },
  {
    id: 'usr_7A03',
    name: 'Devon Clarke',
    email: 'd.clarke@mail.com',
    status: 'active',
    plan: 'Free',
    joined: '2025-09-18',
    lastSeen: '14m ago',
  },
  {
    id: 'usr_2C88',
    name: 'Mei Lin Tan',
    email: 'meilin.tan@mail.com',
    status: 'suspended',
    plan: 'Pro',
    joined: '2025-06-30',
    lastSeen: '3d ago',
  },
  {
    id: 'usr_5E17',
    name: 'Oscar Reyes',
    email: 'oscar.r@mail.com',
    status: 'active',
    plan: 'Pro',
    joined: '2026-01-11',
    lastSeen: '1h ago',
  },
  {
    id: 'usr_1B44',
    name: 'Fatima Haidari',
    email: 'f.haidari@mail.com',
    status: 'inactive',
    plan: 'Free',
    joined: '2025-04-05',
    lastSeen: '41d ago',
  },
  {
    id: 'usr_6D92',
    name: 'Sam Okafor',
    email: 'sam.okafor@mail.com',
    status: 'active',
    plan: 'Pro',
    joined: '2026-02-20',
    lastSeen: 'just now',
  },
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    ts: '2026-08-17 09:41:02',
    actor: 'admin@vaultsaas.app',
    action: 'user.suspend',
    target: 'usr_2C88',
    ip: '103.21.4.18',
    severity: 'warning',
  },
  {
    ts: '2026-08-17 09:12:47',
    actor: 'admin@vaultsaas.app',
    action: 'flag.toggle',
    target: 'weekly_digest_v2',
    ip: '103.21.4.18',
    severity: 'info',
  },
  {
    ts: '2026-08-17 08:58:15',
    actor: 'system',
    action: 'backup.completed',
    target: 'db_primary',
    ip: 'internal',
    severity: 'success',
  },
  {
    ts: '2026-08-16 22:03:39',
    actor: 'admin@vaultsaas.app',
    action: 'user.role_change',
    target: 'usr_5E17',
    ip: '103.21.4.18',
    severity: 'info',
  },
  {
    ts: '2026-08-16 19:47:11',
    actor: 'system',
    action: 'job.failed',
    target: 'email_digest_worker',
    ip: 'internal',
    severity: 'critical',
  },
  {
    ts: '2026-08-16 15:20:04',
    actor: 'support@vaultsaas.app',
    action: 'user.password_reset',
    target: 'usr_7A03',
    ip: '45.19.88.2',
    severity: 'info',
  },
];

export const mockIncidents: IncidentItem[] = [
  {
    date: '2026-08-16',
    title: 'Auth provider elevated error rate',
    status: 'investigating',
    severity: 'critical',
  },
  {
    date: '2026-08-11',
    title: 'Email digest delayed by ~40 min',
    status: 'resolved',
    severity: 'warning',
  },
  {
    date: '2026-07-29',
    title: 'Scheduled DB maintenance',
    status: 'resolved',
    severity: 'info',
  },
];

export const mockAlerts: AlertItem[] = [
  {
    title: 'Auth provider elevated error rate',
    subtitle: 'Investigating · opened yesterday',
    severity: 'critical',
  },
];
