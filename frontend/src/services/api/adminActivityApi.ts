import { apiClientCore } from "./client";

export interface ActivityEntry {
  id: number;
  type: "like" | "follow";
  created_at: string;
  actor_username: string | null;
  recipient_username: string | null;
  post_id: number | null;
  post_title: string | null;
  post_slug: string | null;
}

export const adminActivityApi = {
  list(skip = 0, limit = 50) {
    return apiClientCore.request<ActivityEntry[]>(
      `/api/v1/admin/activity?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },
};
