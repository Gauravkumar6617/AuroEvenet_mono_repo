import { apiClientCore } from "./client";
import {
  LoginResponse,
  OTPVerifyResponse,
  RegisterResponse,
  User,
} from "./types";

export const authApi = {
  register(userData: {
    email: string;
    username: string;
    password: string;
    oauth_provider?: string;
    oauth_id?: string;
  }) {
    return apiClientCore.request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login(credentials: { email: string; password: string; user_Agent?: string }) {
    return apiClientCore.request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return apiClientCore.request<any>("/api/v1/auth/logout", {
      method: "POST",
    });
  },

  getMe() {
    return apiClientCore.request<User>("/api/v1/auth/me", {
      method: "GET",
    });
  },

  verifyEmail(token: string) {
    return apiClientCore.request<string>(`/api/v1/auth/verify?token=${token}`, {
      method: "GET",
    });
  },

  verifyOTP(data: { email: string; otp: string }) {
    return apiClientCore.request<OTPVerifyResponse>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resendOTP(email: string) {
    return apiClientCore.request<string>(
      `/api/v1/auth/resend-otp?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      },
    );
  },

  googleCallback(code: string) {
    return apiClientCore.request<any>(`/api/v1/auth/google/callback?code=${code}`, {
      method: "GET",
    });
  },

  githubCallback(code: string) {
    return apiClientCore.request<any>(`/api/v1/auth/github/callback?code=${code}`, {
      method: "GET",
    });
  },
};
