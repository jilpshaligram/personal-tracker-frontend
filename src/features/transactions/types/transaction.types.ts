export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionCategory {
  id: string;
  _id?: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  _id?: string;
  userId: string;
  categoryId: string | TransactionCategory;
  savingGoalId: string | null;
  type: TransactionType;
  billId: string | null;
  amount: number;
  paymentMethod: string;
  description: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilterDto {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const PAYMENT_METHODS = [
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'UPI',
  'BANK_TRANSFER',
  'OTHER',
];
