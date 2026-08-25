import { useState, useEffect, useMemo, useCallback } from 'react';
import { billService } from '../services/billService';
import type {
  Bill,
  BillCategory,
  BillFilters,
  BillSortField,
  CreateBillPayload,
  PayBillPayload,
  SortOrder,
  UpdateBillPayload,
} from '../types/bill';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [totalBills, setTotalBills] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<BillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BillFilters>({});
  const [reloadKey, setReloadKey] = useState(0);

  const [sortField, setSortField] = useState<BillSortField | null>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const refresh = useCallback((clearFilters = true) => {
    if (clearFilters) {
      setFilters({});
      setCurrentPage(1);
    }
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams: BillFilters = {
          ...filters,
          page: currentPage,
          limit: pageSize,
          sortBy: sortField || undefined,
          sortOrder: sortOrder,
        };

        const [catListResult, billsResult] = await Promise.allSettled([
          billService.getCategories(),
          billService.getBills(queryParams),
        ]);

        if (!active) return;

        if (catListResult.status === 'fulfilled') {
          const expenseCategories = (catListResult.value || []).filter(
            (cat) => !cat.type || cat.type === 'EXPENSE'
          );
          setCategories(expenseCategories);
        }

        if (billsResult.status === 'fulfilled') {
          const res = billsResult.value;
          let items = res.data || [];

          if (filters.isRecurring !== undefined) {
            if (filters.isRecurring === true) {
              items = items.filter(
                (b) => b.isRecurring === true || (b.isRecurring as unknown) === 'true'
              );
            } else if (filters.isRecurring === false) {
              items = items.filter(
                (b) =>
                  b.isRecurring === false ||
                  (b.isRecurring as unknown) === 'false' ||
                  b.isRecurring === undefined ||
                  b.isRecurring === null
              );
            }
          }

          if (filters.categoryId) {
            items = items.filter((b) => {
              const catId =
                typeof b.category === 'object' && b.category
                  ? b.category.id || b.category._id
                  : b.categoryId || b.category;
              return catId === filters.categoryId;
            });
          }

          if (filters.status) {
            items = items.filter(
              (b) => (b.status || '').toUpperCase() === (filters.status || '').toUpperCase()
            );
          }

          if (filters.search) {
            const q = filters.search.toLowerCase();
            items = items.filter(
              (b) =>
                (b.title || '').toLowerCase().includes(q) ||
                (b.notes || '').toLowerCase().includes(q)
            );
          }

          setBills(items);
          const computedTotal =
            items.length !== (res.data || []).length
              ? items.length
              : typeof res.total === 'number'
                ? res.total
                : items.length;
          setTotalBills(computedTotal);
          setTotalPages(
            items.length !== (res.data || []).length
              ? Math.max(1, Math.ceil(items.length / pageSize))
              : res.totalPages || Math.max(1, Math.ceil(computedTotal / pageSize))
          );
        } else {
          const reason = billsResult.reason;
          const msg =
            reason?.response?.data?.message ||
            reason?.message ||
            'Failed to load bills from server';
          setError(msg);
          setBills([]);
          setTotalBills(0);
          setTotalPages(1);
        }
      } catch (err: unknown) {
        if (active) {
          const e = err as { message?: string };
          setError(e?.message || 'Error communicating with server');
          setBills([]);
          setTotalBills(0);
          setTotalPages(1);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [filters, currentPage, pageSize, sortField, sortOrder, reloadKey]);

  const stats = useMemo(() => {
    let totalDue = 0;
    let totalPaid = 0;
    let overdueCount = 0;
    let upcomingCount = 0;

    bills.forEach((b) => {
      const amt = Number(b.amount) || 0;
      const status = (b.status || '').toUpperCase();

      if (status === 'PAID') {
        totalPaid += amt;
      } else {
        totalDue += amt;
        if (status === 'OVERDUE') {
          overdueCount += 1;
        } else {
          upcomingCount += 1;
        }
      }
    });

    return {
      totalDue,
      totalPaid,
      overdueCount,
      upcomingCount,
      totalBills: totalBills || bills.length,
    };
  }, [bills, totalBills]);

  const handleSort = useCallback((field: BillSortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return field;
      } else {
        setSortOrder(field === 'dueDate' || field === 'amount' ? 'desc' : 'asc');
        return field;
      }
    });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleCreateBill = async (payload: CreateBillPayload) => {
    try {
      await billService.createBill(payload);
      refresh(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = errorObj.response?.data?.message || errorObj.message || 'Failed to create bill';
      throw new Error(msg, { cause: err });
    }
  };

  const handleUpdateBill = async (id: string, payload: UpdateBillPayload) => {
    try {
      await billService.updateBill(id, payload);
      refresh(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = errorObj.response?.data?.message || errorObj.message || 'Failed to update bill';
      throw new Error(msg, { cause: err });
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await billService.deleteBill(id);
      refresh(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = errorObj.response?.data?.message || errorObj.message || 'Failed to delete bill';
      throw new Error(msg, { cause: err });
    }
  };

  const handleMarkAsPaid = async (id: string, payload?: PayBillPayload) => {
    try {
      await billService.recordPayment(id, payload);
      refresh(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        errorObj.response?.data?.message || errorObj.message || 'Failed to record payment';
      throw new Error(msg, { cause: err });
    }
  };

  const handleFilterChange = (newFilters: Partial<BillFilters>) => {
    setFilters((prev) => {
      const merged = { ...prev, ...newFilters };
      const cleaned: BillFilters = {};
      (Object.keys(merged) as (keyof BillFilters)[]).forEach((key) => {
        const val = merged[key];
        if (val !== undefined && val !== null && val !== '') {
          (cleaned as Record<string, unknown>)[key] = val;
        }
      });
      return cleaned;
    });
    setCurrentPage(1);
  };

  return {
    bills,
    totalBills,
    categories,
    isLoading,
    error,
    filters,
    stats,
    sortField,
    sortOrder,
    handleSort,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    handleCreateBill,
    handleUpdateBill,
    handleDeleteBill,
    handleMarkAsPaid,
    handleFilterChange,
    handleResetFilters,
    refresh,
  };
};
