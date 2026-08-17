export type NotificationType =
  | 'DOCUMENT'
  | 'BILL'
  | 'BUDGET'
  | 'GOAL'
  | 'SAVING'
  | 'EXPENSE'
  | 'INCOME'
  | 'SECURITY'
  | 'SYSTEM'
  | 'REMINDER'
  | 'CUSTOM';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  referenceId?: string | null;
  referenceModel?: string | null;
  actionUrl?: string | null;
  icon?: string | null;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  expiresAt?: string | null;
  notificationKey?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationFilter {
  search?: string;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
