export interface SavingGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavingGoalFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
