import { apiClientCore } from "./client";
import useAuthStore from "../../store/useAuthStore";

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

export interface LikeCountBatchItem extends LikeCountResponse {
  post_id: number;
}

export interface ToggleLikeRequest {
  post_id: number;
}

const LIKE_CACHE_TTL_MS = 60 * 1000;
const likeCountCache = new Map<string, { expiresAt: number; value: LikeCountResponse }>();

function getViewerCacheKey(postId: number) {
  const accessToken = useAuthStore.getState().accessToken;
  return `${accessToken || "guest"}:${postId}`;
}

function readCachedLike(postId: number) {
  const cacheKey = getViewerCacheKey(postId);
  const cached = likeCountCache.get(cacheKey);
  if (!cached || cached.expiresAt <= Date.now()) {
    likeCountCache.delete(cacheKey);
    return null;
  }
  return cached.value;
}

function writeCachedLike(postId: number, value: LikeCountResponse) {
  likeCountCache.set(getViewerCacheKey(postId), {
    expiresAt: Date.now() + LIKE_CACHE_TTL_MS,
    value,
  });
}

function invalidateCachedLike(postId: number) {
  for (const cacheKey of likeCountCache.keys()) {
    if (cacheKey.endsWith(`:${postId}`)) {
      likeCountCache.delete(cacheKey);
    }
  }
}

export const likesApi = {
  async createLike(data: LikeCreate) {
    const response = await apiClientCore.request<Like>("/api/v1/likes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    invalidateCachedLike(data.post_id);
    return response;
  },

  async toggleLike(postId: number) {
    const response = await apiClientCore.request<Like | null>("/api/v1/likes/toggle", {
      method: "POST",
      body: JSON.stringify({ post_id: postId }),
    });
    invalidateCachedLike(postId);
    return response;
  },

  async getLikeCount(postId: number) {
    const cached = readCachedLike(postId);
    if (cached) return cached;

    const response = await apiClientCore.request<LikeCountResponse>(`/api/v1/likes/count/${postId}`, {
      method: "GET",
    });
    writeCachedLike(postId, response);
    return response;
  },

  async getLikeCounts(postIds: number[]) {
    const uniquePostIds = Array.from(new Set(postIds));
    const results: Record<number, LikeCountResponse> = {};
    const missingPostIds: number[] = [];

    uniquePostIds.forEach((postId) => {
      const cached = readCachedLike(postId);
      if (cached) {
        results[postId] = cached;
      } else {
        missingPostIds.push(postId);
      }
    });

    if (missingPostIds.length > 0) {
      const response = await apiClientCore.request<LikeCountBatchItem[]>("/api/v1/likes/counts", {
        method: "POST",
        body: JSON.stringify({ post_ids: missingPostIds }),
      });

      response.forEach((item) => {
        const value = { count: item.count, liked: item.liked };
        results[item.post_id] = value;
        writeCachedLike(item.post_id, value);
      });
    }

    return results;
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
