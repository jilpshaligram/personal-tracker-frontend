export type NotificationType = 'danger' | 'warning' | 'success' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  metadata?: {
    expiryDays?: number;
    budgetPercent?: number;
    amount?: number;
    actionLabel?: string;
    actionUrl?: string;
  };
}
