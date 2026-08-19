import {
  growthData,
  latencyData,
  mockAdminUsers,
  mockAlerts,
  mockAuditLogs,
  mockIncidents,
} from '../data/mockAdminData';
import type {
  AdminUser,
  AlertItem,
  AuditLogItem,
  GrowthDataPoint,
  IncidentItem,
  LatencyDataPoint,
} from '../types/superAdmin';

export const superAdminService = {
  getStats: async () => {
    return {
      totalUsers: 1284,
      activeToday: 947,
      systemUptime: '99.97%',
      openAlerts: 1,
    };
  },

  getGrowthData: async (): Promise<GrowthDataPoint[]> => {
    return growthData;
  },

  getLatencyData: async (): Promise<LatencyDataPoint[]> => {
    return latencyData;
  },

  getAlerts: async (): Promise<AlertItem[]> => {
    return mockAlerts;
  },

  getRecentActivity: async (): Promise<AuditLogItem[]> => {
    return mockAuditLogs;
  },

  getIncidents: async (): Promise<IncidentItem[]> => {
    return mockIncidents;
  },

  getUsers: async (): Promise<AdminUser[]> => {
    return mockAdminUsers;
  },

  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    return mockAuditLogs;
  },
};
