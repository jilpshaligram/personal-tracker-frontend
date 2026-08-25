import { apiClient } from '../../../api/client';
import type {
  AdminUser,
  AdminUserStatus,
  AdminUserPlan,
  PaginationMeta,
} from '../types/superAdmin';

interface BackendAdminUser {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  plan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsers {
  items: AdminUser[];
  meta: PaginationMeta;
}

export const adminUserService = {
  getTotalUsers: async (): Promise<{ totalUsers: number }> => {
    const { data } = await apiClient.get('/admin/users/total-users');
    const totalUsers = data?.data?.totalUsers ?? data?.data?.total ?? 0;
    return { totalUsers };
  },

  getUsers: async (params?: Record<string, unknown>): Promise<PaginatedUsers> => {
    const { data } = await apiClient.get('/admin/users', { params });
    const items: BackendAdminUser[] = data?.data ?? [];
    const meta: PaginationMeta = data?.meta ?? {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };

    const formatted = items.map((item) => {
      const name = `${item.firstName || ''} ${item.lastName || ''}`.trim() || item.email || 'User';
      let status: AdminUserStatus = 'inactive';
      if (item.status === 'ACTIVE') status = 'active';
      else if (item.status === 'SUSPENDED') status = 'suspended';

      let plan: AdminUserPlan = 'Free';
      if (item.plan === 'Pro') plan = 'Pro';
      else if (item.plan === 'Enterprise') plan = 'Enterprise';

      return {
        id: item.id || item._id || '',
        name,
        email: item.email || '',
        status,
        plan,
        joined: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
        lastSeen: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A',
      };
    });

    return { items: formatted, meta };
  },
};
