export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface BudgetOverview {
  period: Period;
  hasBudget: boolean;
  totalBudget: number;
  totalSpent: number;
  remainingAmount: number;
  percentageConsumed: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface CategoryBreakdown {
  period: Period;
  totalSpent: number;
  categories: CategoryBreakdownItem[];
}

export interface DocumentAlert {
  id: string;
  title: string;
  status: 'EXPIRED' | 'NEARING_EXPIRY';
  expiryDate: string;
  daysRemaining: number;
}

export interface UpcomingBill {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: 'PENDING';
}

export interface RecentTransaction {
  id: string;
  entity: string;
  category: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER_TO_SAVING' | 'TRANSFER_FROM_SAVING' | 'OPENING_BALANCE';
}

export interface DashboardStats {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  totalSavings: number;
  totalTargetSavings: number;
}

export interface DashboardSummaryData {
  period: string;
  startDate: string;
  endDate: string;
  stats: DashboardStats;
  budgetOverview: BudgetOverview;
  categoryBreakdown: {
    categories: CategoryBreakdownItem[];
  };
  documentAlerts: DocumentAlert[];
  upcomingBills: UpcomingBill[];
  recentTransactions: RecentTransaction[];
}
