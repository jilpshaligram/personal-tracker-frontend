import type { Period } from '../types';

export function getDateRange(period: Period): { startDate: Date; endDate: Date } {
  const now = new Date();

  switch (period) {
    case 'daily': {
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return { startDate, endDate };
    }
    case 'weekly': {
      // Assuming week starts on Monday
      const day = now.getDay() || 7; // Convert Sunday (0) to 7
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (7 - day),
        23,
        59,
        59,
        999
      );
      return { startDate, endDate };
    }
    case 'monthly': {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate, endDate };
    }
    case 'yearly': {
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { startDate, endDate };
    }
    default:
      throw new Error(`Unsupported period: ${period}`);
  }
}
