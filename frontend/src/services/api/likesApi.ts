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

export const likesApi = {
  createLike(data: LikeCreate) {
    return apiClientCore.request<Like>("/api/v1/likes/", {
      method: "POST",
      body: JSON.stringify(data),
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
