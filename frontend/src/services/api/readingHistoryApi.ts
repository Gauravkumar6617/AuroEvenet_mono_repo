import { apiClientCore } from "./client";

export interface ReadingHistoryEntry {
  id: number;
  post_id: number;
  post_title?: string | null;
  post_slug?: string | null;
  author_name?: string | null;
  duration_seconds: number;
  scrolled_to_bottom?: boolean;
  liked?: boolean;
  created_at: string;
}

export interface TrackHistoryRequest {
  post_id: number;
  duration_seconds?: number;
  scrolled_to_bottom?: boolean;
  liked?: boolean;
}

export const readingHistoryApi = {
  trackReading(data: TrackHistoryRequest) {
    return apiClientCore.request<{ detail: string }>("/api/v1/history", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHistory(skip = 0, limit = 50) {
    return apiClientCore.request<ReadingHistoryEntry[]>(
      `/api/v1/history?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },

  removeFromHistory(postId: number) {
    return apiClientCore.request<{ detail: string }>(
      `/api/v1/history/${postId}`,
      { method: "DELETE" },
    );
  },
};
