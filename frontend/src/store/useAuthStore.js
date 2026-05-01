import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAuth: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false,
        error: null
      }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "blogbyte-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
