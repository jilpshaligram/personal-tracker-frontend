import { useState, useEffect } from 'react';
import { adminUserService } from '../services/adminUserService';

export const useSuperAdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const statsRes = await adminUserService.getTotalUsers();
        setTotalUsers(statsRes.totalUsers);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    totalUsers,
    isLoading,
  };
};
