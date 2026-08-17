import { apiClient } from '../../../api/client';
import type {
  Period,
  BudgetOverview,
  CategoryBreakdown,
  CategoryBreakdownItem,
  DocumentAlert,
  UpcomingBill,
  RecentTransaction,
  DashboardStats,
} from '../types';

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

import { getDateRange } from '../utils/date.utils';

interface SavingGoalDto {
  savedAmount?: number;
}

interface BudgetDto {
  isActive: boolean;
  period: string;
  amount: number;
}

interface CategoryDto {
  _id?: string;
  id?: string;
  name: string;
}

interface DocumentDto {
  id?: string;
  _id?: string;
  title: string;
  status: 'active' | 'expiring' | 'expired';
  expiryDate: string;
  daysRemaining?: number;
}

interface BillDto {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  dueDate: string;
  amount: number;
}

interface TransactionDto {
  id?: string;
  _id?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  categoryId?: string;
  description?: string;
  transactionDate?: string;
  createdAt?: string;
}

export const dashboardService = {
  // We'll pass the calculated income and expense from transactions
  getStats: async (income: number, expense: number): Promise<DashboardStats> => {
    try {
      const [balanceRes, savingsRes] = await Promise.all([
        apiClient.get<ApiSuccessResponse<{ availableBalance: number; currentBalance: number }>>(
          '/wallets/balance'
        ),
        apiClient.get<ApiSuccessResponse<SavingGoalDto[]>>('/saving-goals'),
      ]);

      const currentBalance = balanceRes.data?.data?.currentBalance || 0;
      const savingsGoals = savingsRes.data?.data || [];
      const totalSavings = savingsGoals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);

      return {
        currentBalance,
        monthlyIncome: income,
        monthlyExpense: expense,
        totalSavings,
      };
    } catch (e) {
      console.error('Error fetching stats', e);
      return {
        currentBalance: 0,
        monthlyIncome: income,
        monthlyExpense: expense,
        totalSavings: 0,
      };
    }
  },

  getBudgetOverview: async (): Promise<BudgetOverview | null> => {
    try {
      const res = await apiClient.get<ApiSuccessResponse<BudgetDto[]>>('/budgets');
      const budgets = res.data?.data || [];
      const activeBudget = budgets.find((b: BudgetDto) => b.isActive);

      if (!activeBudget) {
        return {
          period: 'monthly',
          hasBudget: false,
          totalBudget: 0,
          totalSpent: 0,
          remainingAmount: 0,
          percentageConsumed: 0,
        };
      }

      const budgetPeriod = activeBudget.period.toLowerCase() as Period;
      const { startDate, endDate } = getDateRange(budgetPeriod);

      const transactions = await dashboardService.getTransactionsForPeriod(startDate, endDate);
      let totalSpent = 0;
      transactions.forEach((tx) => {
        if (tx.type === 'EXPENSE') totalSpent += tx.amount;
      });

      const totalBudget = activeBudget.amount;
      const remainingAmount = totalBudget - totalSpent;
      const percentageConsumed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        period: budgetPeriod,
        hasBudget: true,
        totalBudget,
        totalSpent,
        remainingAmount: remainingAmount > 0 ? remainingAmount : 0,
        percentageConsumed: Number(percentageConsumed.toFixed(2)),
      };
    } catch (e) {
      console.error('Error fetching budget overview', e);
      return null;
    }
  },

  getCategoryBreakdown: async (
    period: Period,
    transactions: TransactionDto[],
    totalSpent: number
  ): Promise<CategoryBreakdown> => {
    try {
      const res = await apiClient.get<ApiSuccessResponse<CategoryDto[]>>('/transaction-categories');
      const categoriesData = res.data?.data || [];
      const categoryMap = new Map(categoriesData.map((c) => [c._id || c.id, c.name]));

      const expenseTx = transactions.filter((t) => t.type === 'EXPENSE');
      const categoryTotals: Record<string, number> = {};

      expenseTx.forEach((tx) => {
        const catId = tx.categoryId || 'unknown';
        categoryTotals[catId] = (categoryTotals[catId] || 0) + tx.amount;
      });

      const categories: CategoryBreakdownItem[] = Object.keys(categoryTotals)
        .map((catId) => {
          const amount = categoryTotals[catId];
          return {
            categoryId: catId,
            categoryName: categoryMap.get(catId) || 'Uncategorized',
            amount,
            percentage: totalSpent > 0 ? Number(((amount / totalSpent) * 100).toFixed(2)) : 0,
          };
        })
        .sort((a, b) => b.amount - a.amount);

      return {
        period,
        totalSpent,
        categories,
      };
    } catch (e) {
      console.error('Error calculating category breakdown', e);
      return {
        period,
        totalSpent,
        categories: [],
      };
    }
  },

  getDocumentAlerts: async (): Promise<DocumentAlert[]> => {
    try {
      const res = await apiClient.get<ApiSuccessResponse<DocumentDto[]>>('/documents/expiring');
      return (res.data?.data || []).map((doc: DocumentDto) => ({
        id: (doc.id || doc._id) as string,
        title: doc.title,
        status: doc.status === 'expired' ? 'EXPIRED' : 'NEARING_EXPIRY',
        expiryDate: doc.expiryDate,
        daysRemaining: doc.daysRemaining || 0,
      }));
    } catch (e) {
      console.error('Error fetching document alerts', e);
      return [];
    }
  },

  getUpcomingBills: async (): Promise<UpcomingBill[]> => {
    try {
      const res = await apiClient.get<ApiSuccessResponse<BillDto[]>>('/bills/upcoming');
      return (res.data?.data || []).map((bill: BillDto) => ({
        id: (bill.id || bill._id) as string,
        title: (bill.title || bill.name) as string,
        dueDate: bill.dueDate,
        amount: bill.amount,
        status: 'PENDING',
      }));
    } catch (e) {
      console.error('Error fetching upcoming bills', e);
      return [];
    }
  },

  getTransactionsForPeriod: async (startDate: Date, endDate: Date): Promise<TransactionDto[]> => {
    try {
      const res = await apiClient.get<ApiSuccessResponse<TransactionDto[]>>(
        `/transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=100`
      );
      return res.data?.data || [];
    } catch (e) {
      console.error('Error fetching transactions', e);
      return [];
    }
  },

  mapRecentTransactions: (transactions: TransactionDto[]): RecentTransaction[] => {
    return transactions.slice(0, 5).map((tx) => ({
      id: (tx.id || tx._id) as string,
      entity: tx.description || 'Transaction',
      category: tx.categoryId || 'General', // We ideally map this to name but for recent it's okay or we can map it later
      date: (tx.transactionDate || tx.createdAt) as string,
      amount: tx.amount,
      type: tx.type,
    }));
  },
};
