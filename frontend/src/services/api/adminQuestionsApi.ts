import { apiClientCore } from "./client";

export interface AdminQuestionCreate {
  topic_id: number;
  question: string;
  page?: number;
}

export interface AdminQuestionUpdate {
  topic_id?: number;
  question?: string;
  page?: number;
}

export interface AdminQuestionResponse {
  id: number;
  topic_id: number;
  question: string;
  page: number;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export const adminQuestionsApi = {
  createQuestion(payload: AdminQuestionCreate) {
    return apiClientCore.request<AdminQuestionResponse>("/api/v1/admin/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getQuestionsByTopic(topicId: number) {
    return apiClientCore.request<AdminQuestionResponse[]>(`/api/v1/admin/questions/${topicId}`, {
      method: "GET",
    });
  },

  updateQuestion(questionId: number, payload: AdminQuestionUpdate) {
    return apiClientCore.request<AdminQuestionResponse>(`/api/v1/admin/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteQuestion(questionId: number) {
    return apiClientCore.request<void>(`/api/v1/admin/questions/${questionId}`, {
      method: "DELETE",
    });
  },
};
