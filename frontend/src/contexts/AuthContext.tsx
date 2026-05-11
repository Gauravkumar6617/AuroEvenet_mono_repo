import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { User } from "../services/api/types";
import useAuthStore from "../store/useAuthStore";
import { authApi } from "../services/api/authApi";

import { apiClientCore } from "../services/api/client";
import { useToast } from "./ToastContext";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    username?: string;
    full_name?: string;
  }) => Promise<void>;
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { showToast } = useToast();
  const {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    setAuth,
    setLoading,
    setError,
    setAccessToken,
    logout: logoutStore,
    clearError: clearErrorStore,
  } = useAuthStore();

  useEffect(() => {
    // Fetch real user from /auth/me on mount.
    const initAuth = async () => {
      setLoading(true);
      try {
        const storedToken = useAuthStore.getState().accessToken;
        const user = await authApi.getMe(storedToken);
        setAuth(user);
      } catch {
        if (isAuthenticated) {
          logoutStore();
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const tokenResponse = await authApi.login({
          email,
          password,
          user_Agent: navigator.userAgent,
        });

        // Store the access_token in session — bypasses cross-origin cookie blocking
        const token = (tokenResponse as any).access_token ?? null;
        if (token) setAccessToken(token);

        // Fetch real user profile — pass token explicitly as Bearer header
        const user = await authApi.getMe(token);
        setAuth(user);
        showToast("Logged in successfully", "success");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [setLoading, setError, setAuth, setAccessToken, showToast],
  );

  const register = useCallback(
    async (userData: {
      email: string;
      password: string;
      username?: string;
      full_name?: string;
    }) => {
      setLoading(true);
      try {
        await authApi.register({
          email: userData.email,
          username: userData.username || userData.email.split("@")[0],
          password: userData.password,
          oauth_provider: "none",
          oauth_id: "",
        });
        console.log(apiClientCore);

        localStorage.setItem("pending_email", userData.email);
        setLoading(false);
        showToast("Account created. OTP sent to your email.", "success");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [setLoading, setError, showToast],
  );

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      setLoading(true);
      try {
        const response = await authApi.verifyOTP({ email, otp });
        if (response.success) {
          // Backend sets cookies after OTP — fetch real user profile
          const user = await authApi.getMe();
          setAuth(user);
          showToast("Email verified. Welcome to Nexos!", "success");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "OTP verification failed";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw error;
      }
    },
    [setLoading, setError, setAuth, showToast],
  );

  const resendOTP = useCallback(
    async (email: string) => {
      try {
        await authApi.resendOTP(email);
        showToast("OTP resent successfully", "info");
      } catch (error) {
        showToast("Failed to resend OTP", "error");
        throw error;
      }
    },
    [showToast],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      showToast("Logged out successfully", "info");
    } catch (error) {
      console.error("Logout request failed", error);
      showToast("Logged out locally", "info");
    } finally {
      logoutStore();
    }
  }, [logoutStore, showToast]);

  const loginWithGoogle = useCallback(() => {
    // Redirect to Google OAuth login
    const apiUrl =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
    const googleOAuthUrl = `${apiUrl}/api/v1/auth/google/login`;
    console.info("[OAuth] Starting Google login", {
      apiUrl,
      googleOAuthUrl,
      origin: window.location.origin,
    });
    showToast("Redirecting to Google...", "info");
    window.location.href = googleOAuthUrl;
  }, [showToast]);

  const loginWithGitHub = useCallback(() => {
    // Redirect to GitHub OAuth login
    const apiUrl =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
    const githubOAuthUrl = `${apiUrl}/api/v1/auth/github/login`;
    console.info("[OAuth] Starting GitHub login", {
      apiUrl,
      githubOAuthUrl,
      origin: window.location.origin,
    });
    showToast("Redirecting to GitHub...", "info");
    window.location.href = githubOAuthUrl;
  }, [showToast]);

  const clearError = useCallback(() => {
    clearErrorStore();
  }, [clearErrorStore]);

  const value: AuthContextType = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
