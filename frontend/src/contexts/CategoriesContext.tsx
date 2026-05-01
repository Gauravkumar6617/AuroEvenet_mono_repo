import React, { createContext, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { apiClient, Category } from '../services/api';
import useCategoriesStore from '../store/useCategoriesStore';

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
  const {
    categories,
    currentCategory,
    loading,
    error,
    setCategories,
    setCurrentCategory: setCurrentCategoryStore,
    setLoading,
    setError,
    addCategory,
    removeCategory,
    clearError: clearErrorStore,
  } = useCategoriesStore();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllCategories();
      setCategories(Array.isArray(response) ? response as Category[] : []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      setError(errorMessage);
      throw error;
    }
  }, [setCategories, setLoading, setError]);

  const fetchCategoryById = useCallback(async (categoryId: number) => {
    setLoading(true);
    try {
      const category = await apiClient.getCategoryById(categoryId) as Category;
      setCurrentCategoryStore(category);
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category';
      setError(errorMessage);
      throw error;
    }
  }, [setCurrentCategoryStore, setLoading, setError]);

  const createCategory = useCallback(async (categoryData: {
    name: string;
    slug: string;
  }) => {
    setLoading(true);
    try {
      const category = await apiClient.createCategory(categoryData) as Category;
      addCategory(category);
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      setError(errorMessage);
      throw error;
    }
  }, [addCategory, setLoading, setError]);

  const deleteCategory = useCallback(async (categoryId: number) => {
    setLoading(true);
    try {
      await apiClient.deleteCategory(categoryId);
      removeCategory(categoryId);
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      setError(errorMessage);
      throw error;
    }
  }, [removeCategory, setLoading, setError]);

  const clearError = useCallback(() => {
    clearErrorStore();
  }, [clearErrorStore]);

  const setCurrentCategory = useCallback((category: Category | null) => {
    setCurrentCategoryStore(category);
  }, [setCurrentCategoryStore]);

  const value: CategoriesContextType = useMemo(() => ({
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    deleteCategory,
    clearError,
    setCurrentCategory,
  }), [categories, currentCategory, loading, error, fetchCategories, fetchCategoryById, createCategory, deleteCategory, clearError, setCurrentCategory]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};
