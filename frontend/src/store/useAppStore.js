import { create } from "zustand";

const useAppStore = create((set) => ({
  // Auth state
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  // Legacy counter (kept for compatibility)
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useAppStore;
