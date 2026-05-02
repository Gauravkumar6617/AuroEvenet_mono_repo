import { apiClientCore } from "./client";
import { Category } from "./types";

export const categoriesApi = {
  createCategory(categoryData: { name: string; slug: string }) {
    return apiClientCore.request<Category>("/api/v1/categories/", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  getAllCategories() {
    return apiClientCore.request<Category[]>("/api/v1/categories/", {
      method: "GET",
    }, true);
  },

  getCategoryById(categoryId: number) {
    return apiClientCore.request<Category>(`/api/v1/categories/${categoryId}`, {
      method: "POST",
    });
  },

  deleteCategory(categoryId: number) {
    return apiClientCore.request<string>(`/api/v1/categories/${categoryId}`, {
      method: "DELETE",
    });
  },
};
