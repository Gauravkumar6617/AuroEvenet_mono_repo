import { apiClientCore } from "./client";

export interface AdminCategoryPayload {
  name: string;
  slug: string;
  is_active?: boolean;
}

export interface AdminCategoryResponse {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const adminCategoriesApi = {
  listCategories() {
    return apiClientCore.request<AdminCategoryResponse[]>("/api/v1/admin/categories", {
      method: "GET",
    });
  },

  createCategory(payload: AdminCategoryPayload) {
    return apiClientCore.request<AdminCategoryResponse>("/api/v1/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateCategory(categoryId: number, payload: Partial<AdminCategoryPayload>) {
    return apiClientCore.request<AdminCategoryResponse>(`/api/v1/admin/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteCategory(categoryId: number) {
    return apiClientCore.request<void>(`/api/v1/admin/categories/${categoryId}`, {
      method: "DELETE",
    });
  },
};
