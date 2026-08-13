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

/**
 * Mock data simulation delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return {
      currentBalance: 12450.0,
      monthlyIncome: 8500.0,
      monthlyExpense: 4312.18,
      totalSavings: 4187.82,
    };
  },

  getBudgetOverview: async (period: Period): Promise<BudgetOverview> => {
    await delay(400);
    const mockData: Record<Period, BudgetOverview> = {
      daily: {
        period: 'daily',
        totalBudget: 200,
        totalSpent: 120,
        remainingAmount: 80,
        percentageConsumed: 60,
      },
      weekly: {
        period: 'weekly',
        totalBudget: 1500,
        totalSpent: 1100,
        remainingAmount: 400,
        percentageConsumed: 73,
      },
      monthly: {
        period: 'monthly',
        totalBudget: 5500,
        totalSpent: 4312.18,
        remainingAmount: 1187.82,
        percentageConsumed: 78,
      },
      yearly: {
        period: 'yearly',
        totalBudget: 60000,
        totalSpent: 45000,
        remainingAmount: 15000,
        percentageConsumed: 75,
      },
    };
    return mockData[period];
  },

  getCategoryBreakdown: async (period: Period): Promise<CategoryBreakdown> => {
    await delay(400);

    // Using different mock data based on period to show interaction
    const categoryMocks: Record<Period, CategoryBreakdownItem[]> = {
      daily: [
        { categoryId: 'c1', categoryName: 'Food', amount: 45, percentage: 37.5 },
        { categoryId: 'c4', categoryName: 'Fuel', amount: 30, percentage: 25 },
        { categoryId: 'c6', categoryName: 'Other', amount: 45, percentage: 37.5 },
      ],
      weekly: [
        { categoryId: 'c1', categoryName: 'Food', amount: 350, percentage: 31.8 },
        { categoryId: 'c3', categoryName: 'Grocery', amount: 250, percentage: 22.7 },
        { categoryId: 'c2', categoryName: 'Shopping', amount: 200, percentage: 18.1 },
        { categoryId: 'c4', categoryName: 'Fuel', amount: 150, percentage: 13.6 },
        { categoryId: 'c6', categoryName: 'Other', amount: 150, percentage: 13.6 },
      ],
      monthly: [
        { categoryId: 'c1', categoryName: 'Food', amount: 1423.01, percentage: 33 },
        { categoryId: 'c2', categoryName: 'Shopping', amount: 905.55, percentage: 21 },
        { categoryId: 'c3', categoryName: 'Grocery', amount: 776.19, percentage: 18 },
        { categoryId: 'c4', categoryName: 'Fuel', amount: 517.46, percentage: 12 },
        { categoryId: 'c5', categoryName: 'Bills', amount: 431.21, percentage: 10 },
        { categoryId: 'c6', categoryName: 'Other', amount: 258.76, percentage: 6 },
      ],
      yearly: [
        { categoryId: 'c1', categoryName: 'Food', amount: 15000, percentage: 33.3 },
        { categoryId: 'c5', categoryName: 'Bills', amount: 12000, percentage: 26.6 },
        { categoryId: 'c3', categoryName: 'Grocery', amount: 8000, percentage: 17.7 },
        { categoryId: 'c2', categoryName: 'Shopping', amount: 5000, percentage: 11.1 },
        { categoryId: 'c4', categoryName: 'Fuel', amount: 3000, percentage: 6.6 },
        { categoryId: 'c7', categoryName: 'Travel', amount: 2000, percentage: 4.4 },
      ],
    };

    const totalSpentMocks: Record<Period, number> = {
      daily: 120,
      weekly: 1100,
      monthly: 4312.18,
      yearly: 45000,
    };

    return {
      period,
      totalSpent: totalSpentMocks[period],
      categories: categoryMocks[period],
    };
  },

  getDocumentAlerts: async (): Promise<DocumentAlert[]> => {
    await delay(300);
    return [
      {
        id: 'doc-1',
        title: 'Passport Renewal',
        status: 'EXPIRED',
        expiryDate: '2023-12-01',
        daysRemaining: -45,
      },
      {
        id: 'doc-2',
        title: "Driver's License",
        status: 'NEARING_EXPIRY',
        expiryDate: '2024-11-15',
        daysRemaining: 45,
      },
    ];
  },

  getUpcomingBills: async (): Promise<UpcomingBill[]> => {
    await delay(300);
    return [
      {
        id: 'bill-1',
        title: 'Netflix Premium',
        dueDate: '2024-10-28',
        amount: 19.99,
        status: 'PENDING',
      },
      {
        id: 'bill-2',
        title: 'Electricity Bill',
        dueDate: '2024-11-01',
        amount: 85.5,
        status: 'PENDING',
      },
      {
        id: 'bill-3',
        title: 'Internet Provider',
        dueDate: '2024-11-05',
        amount: 50.0,
        status: 'PENDING',
      },
    ];
  },

  getRecentTransactions: async (): Promise<RecentTransaction[]> => {
    await delay(300);
    return [
      {
        id: 'txn-1',
        entity: 'Whole Foods Market',
        category: 'Grocery',
        date: '2024-10-24T14:20:00Z',
        amount: 120.45,
        type: 'EXPENSE',
      },
      {
        id: 'txn-2',
        entity: 'Shell Station',
        category: 'Fuel',
        date: '2024-10-22T08:15:00Z',
        amount: 45.0,
        type: 'EXPENSE',
      },
      {
        id: 'txn-3',
        entity: 'Tech Corp Inc.',
        category: 'Salary',
        date: '2024-10-20T10:00:00Z',
        amount: 4200.0,
        type: 'INCOME',
      },
      {
        id: 'txn-4',
        entity: 'Amazon.com',
        category: 'Shopping',
        date: '2024-10-18T16:45:00Z',
        amount: 78.99,
        type: 'EXPENSE',
      },
    ];
  },
};
