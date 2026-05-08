import { authApi } from "./authApi";
import { categoriesApi } from "./categoriesApi";
import { postsApi } from "./postsApi";
import { systemApi } from "./systemApi";
import { commentsApi } from "./commentsApi";
import { likesApi } from "./likesApi";
import { readingHistoryApi } from "./readingHistoryApi";
import { communitiesApi } from "./communitiesApi";
import { aiApi } from "./aiApi";
import { userApi } from "./userApi";
import { adminQuestionsApi } from "./adminQuestionsApi";

export * from "./types";
export * from "./commentsApi";
export * from "./likesApi";
export * from "./readingHistoryApi";
export * from "./communitiesApi";
export * from "./aiApi";
export * from "./userApi";
export * from "./adminQuestionsApi";
export { ApiClient, apiClientCore } from "./client";

// Backward-compatible facade with existing apiClient.method() usage.
export const apiClient = {
  ...authApi,
  ...postsApi,
  ...categoriesApi,
  ...systemApi,
  ...commentsApi,
  ...likesApi,
  ...readingHistoryApi,
  ...communitiesApi,
  ...aiApi,
  ...userApi,
  ...adminQuestionsApi,
};
