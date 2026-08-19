import { apiClient } from '../../../api/client';
import type {
  Bill,
  BillCategory,
  BillFilters,
  BillPaymentHistoryItem,
  CreateBillPayload,
  PaginatedBillsResult,
  PayBillPayload,
  UpdateBillPayload,
} from '../types';

function extractData<T>(res: { data: unknown }): T {
  const d = res.data as Record<string, unknown> | null;
  if (d && typeof d === 'object') {
    if (d.data !== undefined) return d.data as T;
    if (d.categories !== undefined) return d.categories as T;
    if (d.bills !== undefined) return d.bills as T;
    if (d.bill !== undefined) return d.bill as T;
    if (d.items !== undefined) return d.items as T;
  }
  return res.data as T;
}

function buildBillFormData(payload: CreateBillPayload | UpdateBillPayload): FormData {
  const formData = new FormData();
  if (payload.categoryId) formData.append('categoryId', payload.categoryId);
  if (payload.title) formData.append('title', payload.title);
  if (payload.description !== undefined && payload.description !== null) {
    formData.append('description', payload.description);
  }
  if (payload.amount !== undefined && payload.amount !== null) {
    formData.append('amount', String(payload.amount));
  }
  if (payload.currency) formData.append('currency', payload.currency);
  if (payload.dueDate) formData.append('dueDate', payload.dueDate);
  if (payload.isRecurring !== undefined && payload.isRecurring !== null) {
    formData.append('isRecurring', String(payload.isRecurring));
  }
  if (payload.recurringType) {
    formData.append('recurringType', payload.recurringType);
  }
  if (payload.reminderDaysBefore !== undefined && payload.reminderDaysBefore !== null) {
    formData.append('reminderDaysBefore', String(payload.reminderDaysBefore));
  }
  if (payload.notes !== undefined && payload.notes !== null) {
    formData.append('notes', payload.notes);
  }
  if (payload.attachment instanceof File) {
    formData.append('attachment', payload.attachment);
  }
  if ('status' in payload && payload.status) {
    formData.append('status', payload.status);
  }
  return formData;
}

export const billService = {
  getBills: async (filters?: BillFilters): Promise<PaginatedBillsResult> => {
    const cleanParams: Record<string, unknown> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }
    const response = await apiClient.get('/bills', { params: cleanParams });
    const resData = response.data;

    let items: Bill[] = [];
    let total = 0;
    let page = filters?.page || 1;
    let limit = filters?.limit || 10;
    let totalPages = 1;

    if (Array.isArray(resData)) {
      items = resData;
      total = resData.length;
      totalPages = Math.max(1, Math.ceil(total / limit));
    } else if (resData && typeof resData === 'object') {
      const d = resData as Record<string, unknown>;

      if (Array.isArray(d.data)) {
        items = d.data as Bill[];
      } else if (Array.isArray(d.bills)) {
        items = d.bills as Bill[];
      } else if (Array.isArray(d.items)) {
        items = d.items as Bill[];
      } else if (d.data && typeof d.data === 'object') {
        const inner = d.data as Record<string, unknown>;
        if (Array.isArray(inner.data)) items = inner.data as Bill[];
        else if (Array.isArray(inner.bills)) items = inner.bills as Bill[];
        else if (Array.isArray(inner.items)) items = inner.items as Bill[];

        if (typeof inner.total === 'number') total = inner.total;
        if (typeof inner.page === 'number') page = inner.page;
        if (typeof inner.limit === 'number') limit = inner.limit;
      }

      const meta = (d.meta || d.pagination || {}) as Record<string, unknown>;
      if (total === 0) {
        if (typeof d.total === 'number') total = d.total;
        else if (typeof d.totalCount === 'number') total = d.totalCount;
        else if (typeof d.count === 'number') total = d.count;
        else if (typeof meta.total === 'number') total = meta.total;
        else total = items.length;
      }

      if (typeof d.page === 'number') page = d.page;
      else if (typeof meta.page === 'number') page = meta.page;

      if (typeof d.limit === 'number') limit = d.limit;
      else if (typeof meta.limit === 'number') limit = meta.limit;

      const innerData =
        d.data && typeof d.data === 'object' ? (d.data as Record<string, unknown>) : null;
      if (typeof d.totalPages === 'number') totalPages = d.totalPages;
      else if (typeof meta.totalPages === 'number') totalPages = meta.totalPages;
      else if (innerData && typeof innerData.totalPages === 'number')
        totalPages = innerData.totalPages;
      else totalPages = Math.max(1, Math.ceil(total / limit));
    }

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.max(1, totalPages),
    };
  },

  getUpcomingBills: async (): Promise<Bill[]> => {
    const response = await apiClient.get('/bills/upcoming');
    const data = extractData<Bill[]>(response);
    return Array.isArray(data) ? data : [];
  },

  getOverdueBills: async (): Promise<Bill[]> => {
    const response = await apiClient.get('/bills/overdue');
    const data = extractData<Bill[]>(response);
    return Array.isArray(data) ? data : [];
  },

  getBillById: async (id: string): Promise<Bill> => {
    const response = await apiClient.get(`/bills/${id}`);
    return extractData<Bill>(response);
  },

  createBill: async (payload: CreateBillPayload): Promise<Bill> => {
    if (payload.attachment instanceof File) {
      const formData = buildBillFormData(payload);
      const response = await apiClient.post('/bills', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData<Bill>(response);
    }

    const cleanPayload = { ...payload };
    delete cleanPayload.attachment;
    const response = await apiClient.post('/bills', {
      ...cleanPayload,
      isRecurring: Boolean(payload.isRecurring),
    });
    return extractData<Bill>(response);
  },

  updateBill: async (id: string, payload: UpdateBillPayload): Promise<Bill> => {
    if (payload.attachment instanceof File) {
      const formData = buildBillFormData(payload);
      const response = await apiClient.patch(`/bills/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return extractData<Bill>(response);
    }

    const cleanPayload = { ...payload };
    delete cleanPayload.attachment;
    const response = await apiClient.patch(`/bills/${id}`, {
      ...cleanPayload,
      ...(payload.isRecurring !== undefined && {
        isRecurring: Boolean(payload.isRecurring),
      }),
    });
    return extractData<Bill>(response);
  },

  deleteBill: async (id: string): Promise<void> => {
    await apiClient.delete(`/bills/${id}`);
  },

  deleteAttachment: async (id: string): Promise<void> => {
    await apiClient.delete(`/bills/${id}/attachment`);
  },

  recordPayment: async (id: string, payload?: PayBillPayload): Promise<Bill> => {
    try {
      const response = await apiClient.post(`/bills/${id}/pay`, payload || {});
      return extractData<Bill>(response);
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
      if (errorObj.response?.status === 404) {
        try {
          const patchRes = await apiClient.patch(`/bills/${id}/pay`, payload || {});
          return extractData<Bill>(patchRes);
        } catch {
          try {
            const updateRes = await apiClient.patch(`/bills/${id}`, {
              status: 'PAID',
              paidDate: new Date().toISOString(),
              ...(payload || {}),
            });
            return extractData<Bill>(updateRes);
          } catch {
            throw err;
          }
        }
      }
      throw err;
    }
  },

  getBillPaymentHistory: async (id: string): Promise<BillPaymentHistoryItem[]> => {
    try {
      const response = await apiClient.get(`/bills/${id}/history`);
      const resData = response.data;
      if (Array.isArray(resData)) return resData;
      if (resData && typeof resData === 'object') {
        const d = resData as Record<string, unknown>;
        if (Array.isArray(d.data)) return d.data as BillPaymentHistoryItem[];
        if (Array.isArray(d.history)) return d.history as BillPaymentHistoryItem[];
        if (Array.isArray(d.items)) return d.items as BillPaymentHistoryItem[];
      }
      return [];
    } catch (err) {
      console.warn(`Failed to fetch payment history for bill ${id}:`, err);
      return [];
    }
  },

  getCategories: async (): Promise<BillCategory[]> => {
    try {
      const response = await apiClient.get('/transaction-categories', {
        params: { type: 'EXPENSE', limit: 100 },
      });
      const rawData = extractData<BillCategory[] | { data: BillCategory[] }>(response);
      const data = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
      if (Array.isArray(data)) {
        return data.filter((cat) => !cat.type || cat.type === 'EXPENSE');
      }
    } catch (err) {
      console.warn('Failed to fetch transaction categories from /transaction-categories:', err);
    }
    return [];
  },

  createCategory: async (payload: {
    name: string;
    type?: 'EXPENSE' | 'INCOME';
    icon?: string;
    color?: string;
  }): Promise<BillCategory> => {
    const response = await apiClient.post('/transaction-categories', {
      type: 'EXPENSE',
      ...payload,
    });
    return extractData<BillCategory>(response);
  },
};
