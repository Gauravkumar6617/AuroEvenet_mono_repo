import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiClient, Category } from '../services/api';

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

interface CategoriesContextType extends CategoriesState {
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (categoryId: number) => Promise<void>;
  createCategory: (categoryData: {
    name: string;
    slug: string;
  }) => Promise<Category>;
  deleteCategory: (categoryId: number) => Promise<void>;
  clearError: () => void;
  setCurrentCategory: (category: Category | null) => void;
}

type CategoriesAction =
  | { type: 'FETCH_CATEGORIES_START' }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
  | { type: 'FETCH_CATEGORIES_FAILURE'; payload: string }
  | { type: 'FETCH_CATEGORY_START' }
  | { type: 'FETCH_CATEGORY_SUCCESS'; payload: Category }
  | { type: 'FETCH_CATEGORY_FAILURE'; payload: string }
  | { type: 'CREATE_CATEGORY_START' }
  | { type: 'CREATE_CATEGORY_SUCCESS'; payload: Category }
  | { type: 'CREATE_CATEGORY_FAILURE'; payload: string }
  | { type: 'DELETE_CATEGORY_START' }
  | { type: 'DELETE_CATEGORY_SUCCESS'; payload: number }
  | { type: 'DELETE_CATEGORY_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_CATEGORY'; payload: Category | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

const categoriesReducer = (state: CategoriesState, action: CategoriesAction): CategoriesState => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_START':
    case 'FETCH_CATEGORY_START':
    case 'CREATE_CATEGORY_START':
    case 'DELETE_CATEGORY_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_CATEGORY_SUCCESS':
    case 'CREATE_CATEGORY_SUCCESS':
      return {
        ...state,
        currentCategory: action.payload,
        loading: false,
        error: null,
        categories: action.type === 'CREATE_CATEGORY_SUCCESS' 
          ? [...state.categories, action.payload]
          : state.categories,
      };
    case 'DELETE_CATEGORY_SUCCESS':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        loading: false,
        error: null,
      };
    case 'FETCH_CATEGORIES_FAILURE':
    case 'FETCH_CATEGORY_FAILURE':
    case 'CREATE_CATEGORY_FAILURE':
    case 'DELETE_CATEGORY_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, initialState);

  const fetchCategories = async () => {
    dispatch({ type: 'FETCH_CATEGORIES_START' });
    try {
      const response = await apiClient.getAllCategories();
      dispatch({ 
        type: 'FETCH_CATEGORIES_SUCCESS', 
        payload: Array.isArray(response) ? response as Category[] : []
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      dispatch({ type: 'FETCH_CATEGORIES_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const fetchCategoryById = async (categoryId: number) => {
    dispatch({ type: 'FETCH_CATEGORY_START' });
    try {
      const category = await apiClient.getCategoryById(categoryId) as Category;
      dispatch({ type: 'FETCH_CATEGORY_SUCCESS', payload: category });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category';
      dispatch({ type: 'FETCH_CATEGORY_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const createCategory = async (categoryData: {
    name: string;
    slug: string;
  }) => {
    dispatch({ type: 'CREATE_CATEGORY_START' });
    try {
      const category = await apiClient.createCategory(categoryData) as Category;
      dispatch({ type: 'CREATE_CATEGORY_SUCCESS', payload: category });
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      dispatch({ type: 'CREATE_CATEGORY_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const deleteCategory = async (categoryId: number) => {
    dispatch({ type: 'DELETE_CATEGORY_START' });
    try {
      await apiClient.deleteCategory(categoryId);
      dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: categoryId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      dispatch({ type: 'DELETE_CATEGORY_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setCurrentCategory = (category: Category | null) => {
    dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });
  };

  const value: CategoriesContextType = {
    ...state,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    deleteCategory,
    clearError,
    setCurrentCategory,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};
