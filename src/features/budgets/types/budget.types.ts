export interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'ON_TRACK' | 'WARNING' | 'EXCEEDED';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  amount: number;
}

export interface CategoryBreakdownResponse {
  budgetAmount: number;
  spentAmount: number;
  categories: CategoryBreakdownItem[];
}

export interface CreateBudgetDto {
  amount: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface UpdateBudgetDto {
  amount?: number;
  period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}
