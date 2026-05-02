import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { apiClient, Post } from "../services/api/index";
import usePostsStore from "../store/usePostsStore";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

interface PostsContextType extends PostsState {
  fetchPosts: (params?: {
    skip?: number;
    limit?: number;
    category_id?: number;
  }) => Promise<void>;
  fetchPostById: (postId: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  createPost: (postData: {
    title: string;
    content: string;
    category_id: number;
    tags?: string;
    thumbnail: File;
  }) => Promise<Post>;
  deletePost: (postId: number) => Promise<void>;
  clearError: () => void;
  setCurrentPost: (post: Post | null) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const {
    posts,
    currentPost,
    loading,
    error,
    pagination,
    setPosts,
    setCurrentPost: setCurrentPostStore,
    setLoading,
    setError,
    addPost,
    removePost,
    setPagination,
    clearError: clearErrorStore,
  } = usePostsStore();

  const fetchPosts = useCallback(
    async (params?: {
      skip?: number;
      limit?: number;
      category_id?: number;
    }) => {
      setLoading(true);
      try {
        const response = await apiClient.getAllPosts(params);
        const postsData = Array.isArray(response)
          ? (response as Post[])
          : (response as any).posts || [];
        const total = (response as any)?.total || postsData.length;

        setPosts(postsData, total);
        if (params?.skip !== undefined || params?.limit !== undefined) {
          setPagination({ skip: params.skip || 0, limit: params.limit || 10 });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch posts";
        setError(errorMessage);
        throw error;
      }
    },
    [setPosts, setLoading, setError, setPagination],
  );

  const fetchPostById = useCallback(
    async (postId: number) => {
      setLoading(true);
      try {
        const post = (await apiClient.getPostById(postId)) as Post;
        setCurrentPostStore(post);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch post";
        setError(errorMessage);
        throw error;
      }
    },
    [setCurrentPostStore, setLoading, setError],
  );

  const fetchPostBySlug = useCallback(
    async (slug: string) => {
      setLoading(true);
      try {
        const post = (await apiClient.getPostBySlug(slug)) as Post;
        setCurrentPostStore(post);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch post";
        setError(errorMessage);
        throw error;
      }
    },
    [setCurrentPostStore, setLoading, setError],
  );

  const createPost = useCallback(
    async (postData: {
      title: string;
      content: string;
      category_id: number;
      tags?: string;
      thumbnail: File;
    }) => {
      setLoading(true);
      try {
        const post = (await apiClient.createPost({
          title: postData.title,
          content: postData.content,
          category_id: postData.category_id,
          tags: postData.tags || "",
          thumbnail: postData.thumbnail,
        })) as Post;
        addPost(post);
        return post;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create post";
        setError(errorMessage);
        throw error;
      }
    },
    [addPost, setLoading, setError],
  );

  const deletePost = useCallback(
    async (postId: number) => {
      setLoading(true);
      try {
        await apiClient.deletePost(postId);
        removePost(postId);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete post";
        setError(errorMessage);
        throw error;
      }
    },
    [removePost, setLoading, setError],
  );

  const clearError = useCallback(() => {
    clearErrorStore();
  }, [clearErrorStore]);

  const setCurrentPost = useCallback(
    (post: Post | null) => {
      setCurrentPostStore(post);
    },
    [setCurrentPostStore],
  );

  const value: PostsContextType = useMemo(
    () => ({
      posts,
      currentPost,
      loading,
      error,
      pagination,
      fetchPosts,
      fetchPostById,
      fetchPostBySlug,
      createPost,
      deletePost,
      clearError,
      setCurrentPost,
    }),
    [
      posts,
      currentPost,
      loading,
      error,
      pagination,
      fetchPosts,
      fetchPostById,
      fetchPostBySlug,
      createPost,
      deletePost,
      clearError,
      setCurrentPost,
    ],
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};
