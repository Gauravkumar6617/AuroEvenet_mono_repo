import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set) => ({
      // Legacy counter (kept for compatibility)
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: "blogbyte-app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useAppStore;
