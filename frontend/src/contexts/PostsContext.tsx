import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiClient, Post } from '../services/api';

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
  fetchPosts: (params?: { skip?: number; limit?: number; category_id?: number }) => Promise<void>;
  fetchPostById: (postId: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  createPost: (postData: {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    category_id?: number;
    tags?: number[];
  }) => Promise<Post>;
  deletePost: (postId: number) => Promise<void>;
  clearError: () => void;
  setCurrentPost: (post: Post | null) => void;
}

type PostsAction =
  | { type: 'FETCH_POSTS_START' }
  | { type: 'FETCH_POSTS_SUCCESS'; payload: { posts: Post[]; total?: number } }
  | { type: 'FETCH_POSTS_FAILURE'; payload: string }
  | { type: 'FETCH_POST_START' }
  | { type: 'FETCH_POST_SUCCESS'; payload: Post }
  | { type: 'FETCH_POST_FAILURE'; payload: string }
  | { type: 'CREATE_POST_START' }
  | { type: 'CREATE_POST_SUCCESS'; payload: Post }
  | { type: 'CREATE_POST_FAILURE'; payload: string }
  | { type: 'DELETE_POST_START' }
  | { type: 'DELETE_POST_SUCCESS'; payload: number }
  | { type: 'DELETE_POST_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_POST'; payload: Post | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    skip: 0,
    limit: 10,
    total: 0,
  },
};

const postsReducer = (state: PostsState, action: PostsAction): PostsState => {
  switch (action.type) {
    case 'FETCH_POSTS_START':
    case 'FETCH_POST_START':
    case 'CREATE_POST_START':
    case 'DELETE_POST_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        posts: action.payload.posts,
        loading: false,
        error: null,
        pagination: {
          ...state.pagination,
          total: action.payload.total || state.posts.length,
        },
      };
    case 'FETCH_POST_SUCCESS':
    case 'CREATE_POST_SUCCESS':
      return {
        ...state,
        currentPost: action.payload,
        loading: false,
        error: null,
        posts: action.type === 'CREATE_POST_SUCCESS' 
          ? [action.payload, ...state.posts]
          : state.posts,
      };
    case 'DELETE_POST_SUCCESS':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        loading: false,
        error: null,
      };
    case 'FETCH_POSTS_FAILURE':
    case 'FETCH_POST_FAILURE':
    case 'CREATE_POST_FAILURE':
    case 'DELETE_POST_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_POST':
      return {
        ...state,
        currentPost: action.payload,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const fetchPosts = async (params?: { skip?: number; limit?: number; category_id?: number }) => {
    dispatch({ type: 'FETCH_POSTS_START' });
    try {
      const response = await apiClient.getAllPosts(params);
      dispatch({ 
        type: 'FETCH_POSTS_SUCCESS', 
        payload: { 
          posts: Array.isArray(response) ? response as Post[] : (response as any).posts || [],
          total: (response as any)?.total 
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
      dispatch({ type: 'FETCH_POSTS_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const fetchPostById = async (postId: number) => {
    dispatch({ type: 'FETCH_POST_START' });
    try {
      const post = await apiClient.getPostById(postId) as Post;
      dispatch({ type: 'FETCH_POST_SUCCESS', payload: post });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
      dispatch({ type: 'FETCH_POST_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const fetchPostBySlug = async (slug: string) => {
    dispatch({ type: 'FETCH_POST_START' });
    try {
      const post = await apiClient.getPostBySlug(slug) as Post;
      dispatch({ type: 'FETCH_POST_SUCCESS', payload: post });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
      dispatch({ type: 'FETCH_POST_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const createPost = async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    category_id?: number;
    tags?: number[];
  }) => {
    dispatch({ type: 'CREATE_POST_START' });
    try {
      const post = await apiClient.createPost(postData) as Post;
      dispatch({ type: 'CREATE_POST_SUCCESS', payload: post });
      return post;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      dispatch({ type: 'CREATE_POST_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const deletePost = async (postId: number) => {
    dispatch({ type: 'DELETE_POST_START' });
    try {
      await apiClient.deletePost(postId);
      dispatch({ type: 'DELETE_POST_SUCCESS', payload: postId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      dispatch({ type: 'DELETE_POST_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setCurrentPost = (post: Post | null) => {
    dispatch({ type: 'SET_CURRENT_POST', payload: post });
  };

  const value: PostsContextType = {
    ...state,
    fetchPosts,
    fetchPostById,
    fetchPostBySlug,
    createPost,
    deletePost,
    clearError,
    setCurrentPost,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
