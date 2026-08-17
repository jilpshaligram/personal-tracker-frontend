import { apiClient } from '../../../api/client';
import type {
  Notification,
  NotificationFilter,
  PaginatedResponse,
  ApiResponse,
} from '../types/notification';

const BASE = '/notifications';

export async function fetchNotifications(
  filter?: NotificationFilter
): Promise<PaginatedResponse<Notification>> {
  const params = new URLSearchParams();
  if (filter?.search) params.set('search', filter.search);
  if (filter?.isRead !== undefined) params.set('isRead', String(filter.isRead));
  if (filter?.type) params.set('type', filter.type);
  if (filter?.priority) params.set('priority', filter.priority);
  if (filter?.page !== undefined) params.set('page', String(filter.page));
  if (filter?.limit !== undefined) params.set('limit', String(filter.limit));

  const query = params.toString();
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(
    query ? `${BASE}?${query}` : BASE
  );
  return res.data.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiClient.get<ApiResponse<{ count: number }>>(`${BASE}/unread-count`);
  return res.data.data.count;
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const res = await apiClient.patch<ApiResponse<Notification>>(`${BASE}/${id}/read`);
  return res.data.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch(`${BASE}/read-all`);
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function deleteAllNotifications(): Promise<void> {
  await apiClient.delete(BASE);
}
