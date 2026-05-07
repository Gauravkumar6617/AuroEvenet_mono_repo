import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      accessToken: null,

      setAuth: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false,
        error: null
      }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      
      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        accessToken: null,
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "blogbyte-auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist user & auth state, not the raw token for XSS safety
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;
