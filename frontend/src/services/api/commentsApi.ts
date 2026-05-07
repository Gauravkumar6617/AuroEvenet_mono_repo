import { apiClientCore } from "./client";

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  content: string;
  post_id: number;
}

export const commentsApi = {
  createComment(data: CommentCreate) {
    return apiClientCore.request<Comment>("/api/v1/comments/comments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAllComments() {
    return apiClientCore.request<Comment[]>(
      "/api/v1/comments/comments",
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  getCommentsByPostId(postId: number) {
    return apiClientCore.request<Comment[]>(
      `/api/v1/comments/comments?post_id=${postId}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  getCommentById(commentId: number) {
    return apiClientCore.request<Comment>(
      `/api/v1/comments/${commentId}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },
};
