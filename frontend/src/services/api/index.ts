import { authApi } from "./authApi";
import { categoriesApi } from "./categoriesApi";
import { postsApi } from "./postsApi";
import { systemApi } from "./systemApi";

export * from "./types";
export { ApiClient, apiClientCore } from "./client";

// Backward-compatible facade with existing apiClient.method() usage.
export const apiClient = {
  ...authApi,
  ...postsApi,
  ...categoriesApi,
  ...systemApi,
};
