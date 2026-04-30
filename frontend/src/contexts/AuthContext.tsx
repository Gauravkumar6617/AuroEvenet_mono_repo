import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { apiClient, User, LoginResponse, RegisterResponse, OTPVerifyResponse } from '../services/api';

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

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'VERIFY_OTP_START' }
  | { type: 'VERIFY_OTP_SUCCESS'; payload: User }
  | { type: 'VERIFY_OTP_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'VERIFY_OTP_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'VERIFY_OTP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'VERIFY_OTP_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiClient.login({ email, password }) as LoginResponse;
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      const user: User = {
        id: 0,
        email,
        username: email.split('@')[0],
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: { email: string; password: string; username?: string; full_name?: string }) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await apiClient.register({
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password,
        oauth_provider: 'none',
        oauth_id: ''
      }) as RegisterResponse;

      localStorage.setItem('pending_email', userData.email);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    dispatch({ type: 'VERIFY_OTP_START' });
    try {
      const response = await apiClient.verifyOTP({ email, otp }) as OTPVerifyResponse;
      if (response.success) {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
        }

        // Even if we don't have a token, we can mark as success if verified
        const user: User = {
          id: 0,
          email,
          username: email.split('@')[0],
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (response.access_token) {
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'VERIFY_OTP_SUCCESS', payload: user });
        } else {
          // If no token, we probably need to redirect to login
          // For now, just clear loading
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      dispatch({ type: 'VERIFY_OTP_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const resendOTP = useCallback(async (email: string) => {
    try {
      await apiClient.resendOTP(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = useMemo(() => ({
    ...state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    clearError,
  }), [state, login, register, verifyOTP, resendOTP, logout, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
