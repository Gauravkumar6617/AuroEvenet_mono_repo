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
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginWithGoogle: () => void;
  loginWithGitHub: () => void;
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

  useEffect(() => {
    // Check if user is already stored in localStorage on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuth(user);
      } catch (error) {
        logoutStore();
      }
    }
  }, [setAuth, logoutStore]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.login({ 
        email, 
        password, 
        user_Agent: navigator.userAgent 
      });

      // Since backend doesn't return user in login response, create a minimal user object
      // You might want to add a /me endpoint to get full user details
      const user: User = {
        id: 0, // This should come from the API
        email,
        username: email.split('@')[0],
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setAuth(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setError, setAuth]);

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
        // Create a minimal user object after successful OTP verification
        const user: User = {
          id: 0, // This should come from the API
          email,
          username: email.split('@')[0],
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        setAuth(user);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setError, setAuth]);

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

  const loginWithGoogle = useCallback(() => {
    // Redirect to Google OAuth login
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
    const googleOAuthUrl = `${apiUrl}/api/v1/auth/google/login`;
    console.info('[OAuth] Starting Google login', {
      apiUrl,
      googleOAuthUrl,
      origin: window.location.origin,
    });
    window.location.href = googleOAuthUrl;
  }, []);

  const loginWithGitHub = useCallback(() => {
    // Redirect to GitHub OAuth login
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
    const githubOAuthUrl = `${apiUrl}/api/v1/auth/github/login`;
    console.info('[OAuth] Starting GitHub login', {
      apiUrl,
      githubOAuthUrl,
      origin: window.location.origin,
    });
    window.location.href = githubOAuthUrl;
  }, []);

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
    setAuth,
    setLoading,
    setError,
    loginWithGoogle,
    loginWithGitHub,
  }), [user, isAuthenticated, loading, error, login, register, verifyOTP, resendOTP, logout, clearError, setAuth, setLoading, setError, loginWithGoogle, loginWithGitHub]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
