import { apiClient } from '../../../api/client';
import type { SavingGoal, SavingGoalFilter } from '../types/savingGoal';
import type { ApiResponse } from '../../notifications/types/notification';

const BASE = '/saving-goals';

interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface BackendSavingGoalsResponse {
  success: boolean;
  message: string;
  data: {
    data: SavingGoal[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export async function fetchSavingGoals(
  filter?: SavingGoalFilter
): Promise<PaginatedData<SavingGoal>> {
  const params = new URLSearchParams();
  if (filter?.page !== undefined) params.set('page', String(filter.page));
  if (filter?.limit !== undefined) params.set('limit', String(filter.limit));
  if (filter?.sortBy) params.set('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.set('sortOrder', filter.sortOrder);
  if (filter?.search) params.set('search', filter.search);

  const query = params.toString();
  const url = query ? `${BASE}?${query}` : BASE;
  const res = await apiClient.get<BackendSavingGoalsResponse>(url);

  let data: SavingGoal[] = [];
  if (res.data && res.data.data) {
    if (Array.isArray(res.data.data)) {
      data = res.data.data;
    } else if (res.data.data.data && Array.isArray(res.data.data.data)) {
      data = res.data.data.data;
    }
  }

  let meta = {
    total: data.length,
    page: filter?.page || 1,
    limit: filter?.limit || 100,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  if (res.data && res.data.data && !Array.isArray(res.data.data) && res.data.data.meta) {
    meta = { ...meta, ...res.data.data.meta };
  }

  return { data, meta };
}

export async function fetchSavingGoalById(id: string): Promise<SavingGoal> {
  const res = await apiClient.get<ApiResponse<SavingGoal>>(`${BASE}/${id}`);
  return res.data.data;
}

export async function createSavingGoal(
  goalData: Omit<
    SavingGoal,
    'id' | 'userId' | 'savedAmount' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'
  >
): Promise<SavingGoal> {
  const payload = {
    title: goalData.title,
    description: goalData.description,
    targetAmount: goalData.targetAmount,
    targetDate: goalData.targetDate ? `${goalData.targetDate}T00:00:00.000Z` : undefined,
  };
  const res = await apiClient.post<ApiResponse<SavingGoal>>(BASE, payload);
  return res.data.data;
}

export async function updateSavingGoal(
  id: string,
  goalData: Partial<
    Omit<
      SavingGoal,
      'id' | 'userId' | 'savedAmount' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'
    >
  >
): Promise<SavingGoal> {
  const payload = {
    title: goalData.title,
    description: goalData.description,
    targetAmount: goalData.targetAmount,
    targetDate: goalData.targetDate ? `${goalData.targetDate}T00:00:00.000Z` : undefined,
  };
  const res = await apiClient.patch<ApiResponse<SavingGoal>>(`${BASE}/${id}`, payload);
  return res.data.data;
}

export async function deleteSavingGoal(id: string): Promise<SavingGoal> {
  const res = await apiClient.delete<ApiResponse<SavingGoal>>(`${BASE}/${id}`);
  return res.data.data;
}

export async function depositSavingGoal(id: string, amount: number): Promise<SavingGoal> {
  const res = await apiClient.post<ApiResponse<SavingGoal>>(`${BASE}/${id}/deposit`, { amount });
  return res.data.data;
}

export async function withdrawSavingGoal(id: string, amount: number): Promise<SavingGoal> {
  const res = await apiClient.post<ApiResponse<SavingGoal>>(`${BASE}/${id}/withdraw`, { amount });
  return res.data.data;
}
