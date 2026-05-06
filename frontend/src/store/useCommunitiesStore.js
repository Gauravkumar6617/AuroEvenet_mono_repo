import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCommunitiesStore = create(
    persist(
        (set) => ({
            communities: [],
            currentCommunity: null,
            loading: false,
            error: null,

            setCommunities: (communities) => set({ communities, loading: false, error: null }),
            setCurrentCommunity: (community) => set({ currentCommunity: community, loading: false, error: null }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error, loading: false }),

            addCommunity: (community) => set((state) => ({
                communities: [community, ...state.communities]
            })),

            clearError: () => set({ error: null }),
        }),
        {
            name: "blogbyte-communities-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCommunitiesStore;
