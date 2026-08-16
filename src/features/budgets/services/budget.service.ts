import { apiClient } from '../../../api/client';
import type {
  Budget,
  CategoryBreakdownResponse,
  CreateBudgetDto,
  UpdateBudgetDto,
} from '../types/budget.types';

// Helper to map summary response to frontend Budget type
function mapSummaryToBudget(summaryData: Record<string, unknown>): Budget {
  const b = summaryData.budget as Record<string, unknown>;
  return {
    id: (b._id || b.id) as string, // Handle both raw mongo document and DTO
    amount: (summaryData.budgetAmount || b.amount || 0) as number,
    spent: (summaryData.spentAmount || 0) as number,
    remaining: (summaryData.remainingAmount || 0) as number,
    percentageUsed: (summaryData.percentageUsed || 0) as number,
    status: (summaryData.status as 'ON_TRACK' | 'WARNING' | 'EXCEEDED') || 'ON_TRACK',
    period: b.period as Budget['period'],
    startDate: b.startDate as string,
    endDate: b.endDate as string,
    createdAt: b.createdAt as string,
    updatedAt: b.updatedAt as string,
  };
}

// Helper to map basic budget DTO to frontend Budget type
function mapDtoToBudget(dto: Record<string, unknown>): Budget {
  return {
    id: (dto.id || dto._id) as string,
    amount: (dto.amount as number) || 0,
    spent: 0, // Not provided by basic DTO
    remaining: (dto.amount as number) || 0,
    percentageUsed: 0,
    status: dto.isActive ? 'ON_TRACK' : 'EXCEEDED', // Fallback for list view
    period: dto.period as Budget['period'],
    startDate: dto.startDate as string,
    endDate: dto.endDate as string,
    createdAt: dto.createdAt as string,
    updatedAt: dto.updatedAt as string,
  };
}

export const budgetService = {
  getCurrentBudget: async (): Promise<Budget> => {
    const response = await apiClient.get<{ data: Record<string, unknown> }>('/budgets/current');
    return mapSummaryToBudget(response.data.data);
  },

  getBudgets: async (): Promise<Budget[]> => {
    const response = await apiClient.get<{ data: { data: Record<string, unknown>[] } }>('/budgets');
    // Backend PaginatedResponseDto wraps the array in `data.data`
    const items = response.data.data?.data || [];
    return items.map(mapDtoToBudget);
  },

  getBudgetById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<{ data: Record<string, unknown> }>(`/budgets/${id}`);
    return mapDtoToBudget(response.data.data);
  },

  createBudget: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await apiClient.post<{ data: Record<string, unknown> }>('/budgets', data);
    return mapDtoToBudget(response.data.data);
  },

  updateBudget: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await apiClient.patch<{ data: Record<string, unknown> }>(
      `/budgets/${id}`,
      data
    );
    return mapDtoToBudget(response.data.data);
  },

  deleteBudget: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(`/budgets/${id}`);
    return response.data;
  },

  getBudgetSummary: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<{ data: Record<string, unknown> }>(
      `/budgets/${id}/summary`
    );
    // getSummary returns the summary object, but we need to fetch the base budget first
    // because getSummary doesn't return the base budget object in the backend!
    // Wait, let's just map it loosely and fetch budget info if needed.
    // Actually, backend getSummary only returns { budgetAmount, spentAmount, remainingAmount, percentageUsed, status }
    // It doesn't return the budget document itself like getCurrentSummary does!
    // So we fetch the budget too:
    const budget = await budgetService.getBudgetById(id);
    const summaryData = response.data.data;
    return {
      ...budget,
      amount: summaryData.budgetAmount as number,
      spent: summaryData.spentAmount as number,
      remaining: summaryData.remainingAmount as number,
      percentageUsed: summaryData.percentageUsed as number,
      status: summaryData.status as 'ON_TRACK' | 'WARNING' | 'EXCEEDED',
    };
  },

  getCategoryBreakdown: async (id: string): Promise<CategoryBreakdownResponse> => {
    const response = await apiClient.get<{ data: CategoryBreakdownResponse }>(
      `/budgets/${id}/category-breakdown`
    );
    return response.data.data;
  },
};
