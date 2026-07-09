import { apiClientCore } from "./client";

export interface EnhanceRequest {
  title: string;
  content: string;
}

export interface EnhanceResponse {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface SuggestTagRequest {
  title: string;
  preview: string;
}

export interface SuggestTagResponse {
  suggested_tags: string[];
}

export interface TopicResponse {
  tag_id: number;
  tag_name: string | null;
  weight: number;
}

export interface TopicWeightUpdate {
  topic_id: number;
  weight: number;
}

export interface SimilarPostMatch {
  id: number;
  title: string;
  slug: string;
}

export const aiApi = {
  getCommentSummary(postId: number) {
    return apiClientCore.request<{ summary: string }>(
      `/api/v1/ai/posts/${postId}/comment-summary`,
      { method: "GET" },
    );
  },

  getDebateSummary(postId: number) {
    return apiClientCore.request<{ summary: string }>(
      `/api/v1/ai/posts/${postId}/debate-summary`,
      { method: "GET" },
    );
  },

  enhanceDraft(payload: EnhanceRequest) {
    return apiClientCore.request<EnhanceResponse>("/api/v1/ai/enhance-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  suggestTags(payload: SuggestTagRequest) {
    return apiClientCore.request<SuggestTagResponse>(
      "/api/v1/ai/suggest-tags",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  getRelatedQuestions(postId: number) {
    return apiClientCore.request<{ questions: string[] }>(
      `/api/v1/ai/posts/${postId}/related-questions`,
      { method: "GET" },
    );
  },

  getMyTopics() {
    return apiClientCore.request<TopicResponse[]>("/api/v1/ai/me/topics", {
      method: "GET",
    });
  },

  addTopic(payload: TopicWeightUpdate) {
    return apiClientCore.request<{ detail: string }>(
      "/api/v1/ai/me/topics",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  removeTopic(topicId: number) {
    return apiClientCore.request<{ detail: string }>(
      `/api/v1/ai/me/topics/${topicId}`,
      { method: "DELETE" },
    );
  },

  checkSimilar(payload: { title: string; category_id?: number | null }) {
    return apiClientCore.request<{ matches: SimilarPostMatch[] }>(
      "/api/v1/ai/check-similar",
      { method: "POST", body: JSON.stringify(payload) },
    );
  },
};
