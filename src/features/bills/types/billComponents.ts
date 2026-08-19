import type {
  Bill,
  BillCategory,
  BillFilters,
  BillSortField,
  BillStatus,
  CreateBillPayload,
  PayBillPayload,
  SortOrder,
} from './bill';
import type { BillPaymentHistoryItem } from './billHistory';

export interface BillCardProps {
  bill: Bill;
  categories: BillCategory[];
  onViewDetails: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
  onMarkAsPaid: (bill: Bill) => void;
}

export interface BillDetailsProps {
  bill: Bill | null;
  categories: BillCategory[];
  isOpen: boolean;
  onClose: () => void;
  onPay: (bill: Bill, remainingAmount?: number) => void;
}

export interface BillFilterBarProps {
  filters: BillFilters;
  categories: BillCategory[];
  onFilterChange: (newFilters: Partial<BillFilters>) => void;
  onReset: () => void;
}

export interface BillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBillPayload) => Promise<void>;
  initialData?: Bill | null;
  categories: BillCategory[];
  isSubmitting: boolean;
}

export interface BillStatusBadgeProps {
  status: BillStatus | string;
  className?: string;
}

export interface BillTableProps {
  bills: Bill[];
  totalBills?: number;
  categories: BillCategory[];
  isLoading: boolean;
  sortField?: BillSortField | null;
  sortOrder?: SortOrder;
  onSort?: (field: BillSortField) => void;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onViewDetails: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
  onMarkAsPaid: (bill: Bill) => void;
  onAddNew: () => void;
}

export interface PayBillDialogProps {
  bill: Bill | null;
  defaultAmount?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (billId: string, payload: PayBillPayload) => Promise<void>;
  isSubmitting: boolean;
}

export interface BillHistoryDetailsProps {
  billAmount: number;
  currency?: string;
  history: BillPaymentHistoryItem[];
  isLoading?: boolean;
  totalPaid: number;
  remainingAmount: number;
  isPartiallyPaid: boolean;
  isFullyPaid: boolean;
  paidPercentage: number;
}

export interface BillHistoryTableProps {
  history: BillPaymentHistoryItem[];
  currency?: string;
  isLoading?: boolean;
}

export interface UseBillHistoryResult {
  history: BillPaymentHistoryItem[];
  isLoading: boolean;
  error: string | null;
  totalPaid: number;
  remainingAmount: number;
  isPartiallyPaid: boolean;
  isFullyPaid: boolean;
  paidPercentage: number;
  refresh: () => void;
}
