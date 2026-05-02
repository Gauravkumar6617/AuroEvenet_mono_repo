import { apiClientCore } from "./client";

export const systemApi = {
  healthCheck() {
    return apiClientCore.request<{ status: string }>("/system/health", {
      method: "GET",
    });
  },
};
