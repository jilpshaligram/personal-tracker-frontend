import { apiClient } from '../../../api/client';
import type {
  Transaction,
  TransactionCategory,
  TransactionFilterDto,
  PaginatedResponse,
} from '../types/transaction.types';

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const transactionService = {
  getTransactions: async (
    filters: TransactionFilterDto
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.categoryId && filters.categoryId !== 'all')
      params.append('categoryId', filters.categoryId);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const { data } = await apiClient.get<ApiSuccessResponse<Transaction[]>>(
      '/transactions?' + params.toString()
    );

    return {
      data: data.data || [],
      total: data.meta?.total || (Array.isArray(data.data) ? data.data.length : 0),
      page: data.meta?.page || 1,
      limit: data.meta?.limit || (Array.isArray(data.data) ? data.data.length : 10),
      totalPages: data.meta?.totalPages || 1,
    };
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await apiClient.get<ApiSuccessResponse<Transaction>>('/transactions/' + id);
    return data.data;
  },

  createTransaction: async (payload: Partial<Transaction>): Promise<Transaction> => {
    const { data } = await apiClient.post<ApiSuccessResponse<Transaction>>(
      '/transactions',
      payload
    );
    return data.data;
  },

  updateTransaction: async (id: string, payload: Partial<Transaction>): Promise<Transaction> => {
    const { data } = await apiClient.patch<ApiSuccessResponse<Transaction>>(
      '/transactions/' + id,
      payload
    );
    return data.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete('/transactions/' + id);
  },

  getTransactionCategories: async (): Promise<TransactionCategory[]> => {
    const { data } = await apiClient.get<
      ApiSuccessResponse<TransactionCategory[] | { data: TransactionCategory[] }>
    >('/transaction-categories?limit=100');
    return Array.isArray(data.data) ? data.data : data.data.data || [];
  },

  createTransactionCategory: async (
    payload: Partial<TransactionCategory>
  ): Promise<TransactionCategory> => {
    const { data } = await apiClient.post<ApiSuccessResponse<TransactionCategory>>(
      '/transaction-categories',
      payload
    );
    return data.data;
  },
};
