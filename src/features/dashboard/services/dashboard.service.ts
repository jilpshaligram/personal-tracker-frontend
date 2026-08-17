import { apiClient } from '../../../api/client';
import type { DashboardSummaryData, Period } from '../types';

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  getDashboardSummary: async (period: Period): Promise<DashboardSummaryData> => {
    try {
      // The backend expects the period in query parameters, e.g., ?period=monthly
      // We map the frontend 'monthly' to 'MONTHLY' if needed, but it looks like the backend is case insensitive
      // or we can pass it directly.
      const res = await apiClient.get<ApiSuccessResponse<DashboardSummaryData>>(
        `/dashboard/summary?period=${period.toLowerCase()}`
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to load dashboard data');
      }

      return res.data.data;
    } catch (e) {
      console.error('Error fetching dashboard summary', e);
      throw e;
    }
  },
};
