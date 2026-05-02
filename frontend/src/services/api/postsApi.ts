import { apiClientCore } from "./client";
import { Post } from "./types";

export const postsApi = {
  createPost(postData: {
    title: string;
    content: string;
    category_id: number;
    tags?: string;
    thumbnail: string;
  }) {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("category_id", postData.category_id.toString());
    if (postData.tags) formData.append("tags", postData.tags);
    formData.append("thumbnail", postData.thumbnail);

    return apiClientCore.request<Post>(
      "/api/v1/posts/",
      {
        method: "POST",
        body: formData,
        headers: {},
      },
      true,
    );
  },

  getAllPosts(params?: Record<string, string | number | boolean>) {
    const queryParams = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
            acc[k] = String(v);
            return acc;
          }, {}),
        ).toString()}`
      : "";

    return apiClientCore.request<Post[]>(`/api/v1/posts/${queryParams}`, {
      method: "GET",
    }, true);
  },

  getPostById(postId: number) {
    return apiClientCore.request<Post>(`/api/v1/posts/${postId}`, {
      method: "GET",
    });
  },

  getPostBySlug(slug: string) {
    return apiClientCore.request<Post>(`/api/v1/posts/slug/${slug}`, {
      method: "GET",
    });
  },

  deletePost(postId: number) {
    return apiClientCore.request<string>(`/api/v1/posts/${postId}`, {
      method: "DELETE",
    });
  },
};
