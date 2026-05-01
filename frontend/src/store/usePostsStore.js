import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const usePostsStore = create(
  persist(
    (set) => ({
      posts: [],
      currentPost: null,
      loading: false,
      error: null,
      pagination: {
        skip: 0,
        limit: 10,
        total: 0,
      },

      setPosts: (posts, total) => set((state) => ({ 
        posts, 
        loading: false, 
        error: null,
        pagination: { ...state.pagination, total: total || posts.length }
      })),
      
      setCurrentPost: (currentPost) => set({ currentPost }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      
      addPost: (post) => set((state) => ({ 
        posts: [post, ...state.posts],
        currentPost: post 
      })),
      
      removePost: (postId) => set((state) => ({
        posts: state.posts.filter(p => p.id !== postId)
      })),

      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),

      clearError: () => set({ error: null }),
    }),
    {
      name: "blogbyte-posts-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePostsStore;
