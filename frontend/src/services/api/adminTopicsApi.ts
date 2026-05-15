import { apiClientCore } from "./client";

export interface AdminTopicPayload {
  name: string;
  slug: string;
  category_id: number;
  is_active?: boolean;
}

export interface AdminTopicResponse {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const adminTopicsApi = {
  listTopics() {
    return apiClientCore.request<AdminTopicResponse[]>("/api/v1/admin/topics", {
      method: "GET",
    });
  },

  createTopic(payload: AdminTopicPayload) {
    return apiClientCore.request<AdminTopicResponse>("/api/v1/admin/topics", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateTopic(topicId: number, payload: Partial<AdminTopicPayload>) {
    return apiClientCore.request<AdminTopicResponse>(`/api/v1/admin/topics/${topicId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteTopic(topicId: number) {
    return apiClientCore.request<void>(`/api/v1/admin/topics/${topicId}`, {
      method: "DELETE",
    });
  },
};
