import { apiClientCore } from "./client";

export interface Like {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface LikeCreate {
  post_id: number;
  user_id: number;
}

export interface LikeCountResponse {
  count: number;
  liked: boolean;
}

export interface ToggleLikeRequest {
  post_id: number;
}

export const likesApi = {
  createLike(data: LikeCreate) {
    return apiClientCore.request<Like>("/api/v1/likes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  toggleLike(postId: number) {
    return apiClientCore.request<Like | null>("/api/v1/likes/toggle", {
      method: "POST",
      body: JSON.stringify({ post_id: postId }),
    });
  },

  getLikeCount(postId: number) {
    return apiClientCore.request<LikeCountResponse>(`/api/v1/likes/count/${postId}`, {
      method: "GET",
    });
  },

  checkLiked(postId: number) {
    return apiClientCore.request<{ liked: boolean }>(`/api/v1/likes/check/${postId}`, {
      method: "GET",
    });
  },

  getAllLikes() {
    return apiClientCore.request<Like[]>("/api/v1/likes/", {
      method: "GET",
    });
  },

  getLikeById(likeId: number) {
    return apiClientCore.request<Like>(`/api/v1/likes/${likeId}`, {
      method: "GET",
    });
  },
};
