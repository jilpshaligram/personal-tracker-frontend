import type { TransactionType } from '../../transactions/types/transaction.types';

export type RecurringType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type BillStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';

export type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'CASH' | 'UPI';

export interface BillCategory {
  id: string;
  _id?: string;
  name: string;
  type?: TransactionType;
  color?: string;
  icon?: string;
}

export interface Bill {
  id: string;
  _id?: string;
  categoryId: string;
  category?: BillCategory | string;
  title: string;

  amount: number;
  currency: string;
  dueDate: string;
  isRecurring: boolean;
  recurringType?: RecurringType;
  reminderDaysBefore?: number;
  notes?: string;
  status: BillStatus;
  paidDate?: string;
  attachment?: string;
  attachmentUrl?: string;
  file?: string;
  fileUrl?: string;
  document?: string;
  documentUrl?: string;
  receipt?: string;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBillPayload {
  categoryId: string;
  title: string;

  amount: number;
  currency: string;
  dueDate: string;
  isRecurring: boolean;
  recurringType?: RecurringType;
  reminderDaysBefore?: number;
  notes?: string;
  attachment?: File | null;
}

export interface UpdateBillPayload extends Partial<CreateBillPayload> {
  status?: BillStatus;
  paidDate?: string;
}

export interface BillFilters {
  status?: string;
  categoryId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface PaginatedBillsResult {
  data: Bill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PayBillPayload {
  amountPaid: number;
  paymentMethod: PaymentMethod | string;
  notes?: string;
  createTransaction?: boolean;
}

export type BillSortField = 'title' | 'category' | 'dueDate' | 'amount' | 'status' | 'recurring';

export type SortOrder = 'asc' | 'desc';
