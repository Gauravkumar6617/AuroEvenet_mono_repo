import React, { createContext, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { apiClient, User, LoginResponse, RegisterResponse, OTPVerifyResponse } from '../services/api';
import useAuthStore from '../store/useAuthStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; username?: string; full_name?: string }) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    setAuth,
    setLoading,
    setError,
    logout: logoutStore,
    clearError: clearErrorStore,
  } = useAuthStore();

  const syncUser = useCallback(async () => {
    try {
      const user = await apiClient.getMe();
      setAuth(user);
    } catch (error) {
      logoutStore();
    }
  }, [setAuth, logoutStore]);

  useEffect(() => {
    // Attempt to sync user on mount if we think we might be authenticated
    // or just always check if a session cookie exists (browser handles it, 
    // we just make the request)
    syncUser();
  }, [syncUser]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.login({ email, password });

      // Tokens are set in HttpOnly cookies by the backend
      // We still need to fetch user info if it wasn't returned or to ensure it's fresh
      await syncUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    }
  }, [syncUser, setLoading, setError]);

  const register = useCallback(async (userData: { email: string; password: string; username?: string; full_name?: string }) => {
    setLoading(true);
    try {
      await apiClient.register({
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password,
        oauth_provider: 'none',
        oauth_id: ''
      });
      console.log(apiClient);

      localStorage.setItem('pending_email', userData.email);
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setError]);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    try {
      const response = await apiClient.verifyOTP({ email, otp });
      if (response.success) {
        // If the backend sets cookies during OTP verify, sync user
        await syncUser();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setError(errorMessage);
      throw error;
    }
  }, [syncUser, setLoading, setError]);

  const resendOTP = useCallback(async (email: string) => {
    try {
      await apiClient.resendOTP(email);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      logoutStore();
    }
  }, [logoutStore]);

  const clearError = useCallback(() => {
    clearErrorStore();
  }, [clearErrorStore]);

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    clearError,
  }), [user, isAuthenticated, loading, error, login, register, verifyOTP, resendOTP, logout, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
