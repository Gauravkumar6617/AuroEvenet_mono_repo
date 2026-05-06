import { apiClientCore } from "./client";
import { Category } from "./types";

const PUBLIC_PREFIX = "/api/v1/categories";
const ADMIN_PREFIX = "/api/v1/admin/categories";

export const categoriesApi = {
  /** Public: list all active categories (no auth needed) */
  getAllCategories() {
    return apiClientCore.request<Category[]>(`${PUBLIC_PREFIX}/`, {
      method: "GET",
    });
  },

  /** Public: get single category by ID */
  getCategoryById(categoryId: number) {
    return apiClientCore.request<Category>(`${PUBLIC_PREFIX}/${categoryId}`, {
      method: "GET",
    });
  },

  /** Admin: create a new category (requires admin/super_admin) */
  createCategory(categoryData: { name: string; slug: string }) {
    return apiClientCore.request<Category>(`${ADMIN_PREFIX}/`, {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  /** Admin: delete a category (requires admin/super_admin) */
  deleteCategory(categoryId: number) {
    return apiClientCore.request<string>(`${ADMIN_PREFIX}/${categoryId}`, {
      method: "DELETE",
    });
  },
};
