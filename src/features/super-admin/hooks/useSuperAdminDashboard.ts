import { useState, useEffect } from 'react';
import { superAdminService } from '../services/superAdminService';
import type {
  AlertItem,
  AuditLogItem,
  GrowthDataPoint,
  IncidentItem,
  LatencyDataPoint,
} from '../types/superAdmin';

export const useSuperAdminDashboard = () => {
  const [range, setRange] = useState('Weekly');
  const [growth, setGrowth] = useState<GrowthDataPoint[]>([]);
  const [latency, setLatency] = useState<LatencyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [growthRes, latencyRes, alertsRes, activityRes, incidentsRes] = await Promise.all([
          superAdminService.getGrowthData(),
          superAdminService.getLatencyData(),
          superAdminService.getAlerts(),
          superAdminService.getRecentActivity(),
          superAdminService.getIncidents(),
        ]);

        setGrowth(growthRes);
        setLatency(latencyRes);
        setAlerts(alertsRes);
        setRecentLogs(activityRes);
        setIncidents(incidentsRes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return {
    range,
    setRange,
    growth,
    latency,
    alerts,
    recentLogs,
    incidents,
    isLoading,
  };
};
