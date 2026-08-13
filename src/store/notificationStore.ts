import { create } from 'zustand';
import type { Notification } from '../features/notifications/types/notification';

interface NotificationState {
  isOpen: boolean;
  notifications: Notification[];
  setIsOpen: (isOpen: boolean) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  getUnreadCount: () => number;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'danger',
    title: 'Passport Renewal',
    description: 'Expiring in 12 days. Renew immediately.',
    time: '2m ago',
    read: false,
    metadata: {
      expiryDays: 12,
      actionLabel: 'View Details',
    },
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget Warning',
    description: 'Groceries category has reached 80% of its monthly limit.',
    time: '1h ago',
    read: false,
    metadata: {
      budgetPercent: 80,
      actionLabel: 'Review Budget',
    },
  },
  {
    id: '3',
    type: 'success',
    title: 'Manual Deposit Confirmed',
    description: '$500 deposited into Emergency Fund.',
    time: '3h ago',
    read: false,
    metadata: {
      amount: 500,
      actionLabel: 'View Transaction',
      actionUrl: '/transactions',
    },
  },
  {
    id: '4',
    type: 'info',
    title: 'Internet Bill Due',
    description: 'Due in 2 days. Amount: $79.99',
    time: 'Yesterday',
    read: false,
    metadata: {
      amount: 79.99,
      actionLabel: 'Pay Now',
      actionUrl: '/bills',
    },
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  isOpen: false,
  notifications: MOCK_NOTIFICATIONS,
  setIsOpen: (isOpen) => set({ isOpen }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
