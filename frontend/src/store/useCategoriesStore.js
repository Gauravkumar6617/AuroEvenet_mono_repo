import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCategoriesStore = create(
  persist(
    (set) => ({
      categories: [],
      currentCategory: null,
      loading: false,
      error: null,

      setCategories: (categories) => set({ categories, loading: false, error: null }),
      setCurrentCategory: (currentCategory) => set({ currentCategory }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      
      addCategory: (category) => set((state) => ({ 
        categories: [...state.categories, category],
        currentCategory: category 
      })),
      
      removeCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(c => c.id !== categoryId)
      })),

      clearError: () => set({ error: null }),
    }),
    {
      name: "blogbyte-categories-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCategoriesStore;
