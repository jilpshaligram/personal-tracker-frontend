import { useState, useEffect, useCallback, useRef } from 'react';
import type { Notification, NotificationFilter } from '../types/notification';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../services/notificationService';
import { useNotificationStore } from '../../../store/notificationStore';

const POLL_INTERVAL_MS = 60_000;

export function useNotifications() {
  const { setUnreadCount } = useNotificationStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>({ page: 1, limit: 20 });

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadNotifications = useCallback(
    async (f?: NotificationFilter) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchNotifications(f ?? filter);
        setNotifications(result.items ?? []);
        setTotal(result.total ?? 0);
      } catch {
        setError('Failed to load notifications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [filter]
  );

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch {
      // silent
    }
  }, [setUnreadCount]);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      try {
        await markNotificationAsRead(id);
        await refreshUnreadCount();
      } catch {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
      }
    },
    [refreshUnreadCount]
  );

  const markAllRead = useCallback(async () => {
    setIsActing(true);
    const prev = notifications;
    setNotifications((ns) => ns.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
    } catch {
      setNotifications(prev);
      await refreshUnreadCount();
    } finally {
      setIsActing(false);
    }
  }, [notifications, setUnreadCount, refreshUnreadCount]);

  const dismiss = useCallback(
    async (id: string) => {
      const prev = notifications;
      setNotifications((ns) => ns.filter((n) => n.id !== id));
      try {
        await deleteNotification(id);
        await refreshUnreadCount();
      } catch {
        setNotifications(prev);
      }
    },
    [notifications, refreshUnreadCount]
  );

  const clearAll = useCallback(async () => {
    setIsActing(true);
    const prev = notifications;
    setNotifications([]);
    setUnreadCount(0);
    try {
      await deleteAllNotifications();
    } catch {
      setNotifications(prev);
      await refreshUnreadCount();
    } finally {
      setIsActing(false);
    }
  }, [notifications, setUnreadCount, refreshUnreadCount]);

  const applyFilter = useCallback(
    (patch: Partial<NotificationFilter>) => {
      const next = { ...filter, ...patch, page: 1 };
      setFilter(next);
      void loadNotifications(next);
    },
    [filter, loadNotifications]
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    Promise.resolve().then(() => {
      void loadNotifications();
      void refreshUnreadCount();
    });

    pollRef.current = setInterval(() => {
      void refreshUnreadCount();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notifications,
    total,
    isLoading,
    isActing,
    error,
    filter,
    markAsRead,
    markAllRead,
    dismiss,
    clearAll,
    applyFilter,
    reload: loadNotifications,
  };
}
