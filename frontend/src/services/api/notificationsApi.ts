import { apiClientCore } from "./client";

export interface Notification {
  id: number;
  type: "like" | "follow";
  is_read: boolean;
  created_at: string;
  actor_id: number;
  actor_username: string | null;
  actor_avatar_url: string | null;
  post_id: number | null;
  post_title: string | null;
  post_slug: string | null;
}

export const notificationsApi = {
  list(skip = 0, limit = 30) {
    return apiClientCore.request<Notification[]>(
      `/api/v1/notifications/?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },

  unreadCount() {
    return apiClientCore.request<{ count: number }>(
      "/api/v1/notifications/unread-count",
      { method: "GET" },
    );
  },

  markRead(id: number) {
    return apiClientCore.request<{ detail: string }>(
      `/api/v1/notifications/${id}/read`,
      { method: "POST" },
    );
  },

  markAllRead() {
    return apiClientCore.request<{ detail: string }>(
      "/api/v1/notifications/read-all",
      { method: "POST" },
    );
  },
};
