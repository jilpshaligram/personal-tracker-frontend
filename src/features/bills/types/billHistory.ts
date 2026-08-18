import type { PaymentMethod } from './bill';

export interface BillPaymentHistoryItem {
  id: string;
  _id?: string;
  billId: string;
  transactionId?: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: PaymentMethod | string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  remarks?: string;
}

export interface BillPaymentHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface BillPaymentHistoryResponse {
  success?: boolean;
  message?: string;
  data: BillPaymentHistoryItem[];
  meta?: BillPaymentHistoryMeta;
}
