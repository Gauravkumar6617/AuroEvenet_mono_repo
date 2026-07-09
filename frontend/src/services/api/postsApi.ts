import { apiClientCore } from "./client";
import { Post } from "./types";

export const postsApi = {
  createPost(postData: {
    title: string;
    content: string;
    category_id: number;
    community_id?: number;
    tags?: string;
    thumbnail: File;
  }) {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("category_id", postData.category_id.toString());
    if (postData.community_id) formData.append("community_id", postData.community_id.toString());
    if (postData.tags) formData.append("tags", postData.tags);
    formData.append("thumbnail", postData.thumbnail, postData.thumbnail.name);

    return apiClientCore.request<Post>("/api/v1/posts/", {
      method: "POST",
      body: formData,
    });
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

    return apiClientCore.request<Post[]>(
      `/api/v1/posts/${queryParams}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  getPostById(postId: number) {
    return apiClientCore.request<Post>(
      `/api/v1/posts/${postId}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  getPostBySlug(slug: string) {
    return apiClientCore.request<Post>(
      `/api/v1/posts/slug/${slug}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  searchPosts(query: string, skip = 0, limit = 10) {
    return apiClientCore.request<Post[]>(
      `/api/v1/posts/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`,
      { method: "GET" },
      false,
      null,
      false,
      false,
    );
  },

  getMyPosts(skip = 0, limit = 50) {
    return apiClientCore.request<Post[]>(
      `/api/v1/posts/my?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },

  getPersonalizedFeed(skip = 0, limit = 20) {
    return apiClientCore.request<Post[]>(
      `/api/v1/posts/feed?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },

  deletePost(postId: number) {
    return apiClientCore.request<string>(`/api/v1/posts/${postId}`, {
      method: "DELETE",
    });
  },
};
