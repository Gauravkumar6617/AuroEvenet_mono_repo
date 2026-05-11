import { apiClientCore } from "./client";
import { Post } from "./types";

export interface Community {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityMemberResponse {
  members: Array<{
    id: number;
    username: string;
    email: string;
    joined_at: string;
  }>;
}

export const communitiesApi = {
  createCommunity(formData: FormData) {
    return apiClientCore.request<{ id: number; slug: string }>(
      "/api/v1/community",
      {
        method: "POST",
        body: formData,
      },
    );
  },

  getCommunity(slug: string) {
    return apiClientCore.request<Community>(`/api/v1/community/${slug}`, {
      method: "GET",
    });
  },

  listCommunities(skip = 0, limit = 20) {
    return apiClientCore.request<Community[]>(
      `/api/v1/community?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },

  getMyCommunities() {
    return apiClientCore.request<Community[]>("/api/v1/community/my", {
      method: "GET",
    });
  },

  getMembers(slug: string) {
    return apiClientCore.request<CommunityMemberResponse>(
      `/api/v1/community/${slug}/members`,
      { method: "GET" },
    );
  },

  joinCommunity(slug: string) {
    return apiClientCore.request<{ detail: string }>(
      `/api/v1/community/${slug}/join`,
      { method: "POST" },
    );
  },

  leaveCommunity(slug: string) {
    return apiClientCore.request<{ detail: string }>(
      `/api/v1/community/${slug}/leave`,
      { method: "DELETE" },
    );
  },

  getCommunityPosts(slug: string, skip = 0, limit = 20) {
    return apiClientCore.request<Post[]>(
      `/api/v1/community/${slug}/posts?skip=${skip}&limit=${limit}`,
      { method: "GET" },
    );
  },
};
