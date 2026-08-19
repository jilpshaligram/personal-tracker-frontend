import { create } from 'zustand';

interface NotificationState {
  isOpen: boolean;
  unreadCount: number;
  setIsOpen: (isOpen: boolean) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  unreadCount: 0,
  setIsOpen: (isOpen) => set({ isOpen }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
}));
