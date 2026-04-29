// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    username?: string;
    full_name?: string;
  }) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(token: string) {
    return this.request(`/api/v1/auth/verify?token=${token}`, {
      method: 'GET',
    });
  }

  async verifyOTP(data: { email: string; otp: string }) {
    return this.request('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendOTP(email: string) {
    return this.request('/api/v1/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // OAuth endpoints
  async googleCallback(code: string) {
    return this.request(`/api/v1/auth/google/callback?code=${code}`, {
      method: 'GET',
    });
  }

  async githubCallback(code: string) {
    return this.request(`/api/v1/auth/github/callback?code=${code}`, {
      method: 'GET',
    });
  }

  // Posts endpoints
  async createPost(postData: {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    category_id?: number;
    tags?: number[];
  }) {
    return this.request('/api/v1/posts/', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getAllPosts(params?: {
    skip?: number;
    limit?: number;
    category_id?: number;
  }) {
    const queryParams = new URLSearchParams(params as any).toString();
    const url = queryParams ? `/api/v1/posts/?${queryParams}` : '/api/v1/posts/';
    return this.request(url, { method: 'GET' });
  }

  async getPostById(postId: number) {
    return this.request(`/api/v1/posts/${postId}`, { method: 'GET' });
  }

  async getPostBySlug(slug: string) {
    return this.request(`/api/v1/posts/slug/${slug}`, { method: 'GET' });
  }

  async deletePost(postId: number) {
    return this.request(`/api/v1/posts/${postId}`, { method: 'DELETE' });
  }

  // Categories endpoints
  async createCategory(categoryData: {
    name: string;
    description?: string;
    slug?: string;
  }) {
    return this.request('/api/v1/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async getAllCategories() {
    return this.request('/api/v1/categories/', { method: 'GET' });
  }

  async getCategoryById(categoryId: number) {
    return this.request(`/api/v1/categories/${categoryId}`, { method: 'GET' });
  }

  async deleteCategory(categoryId: number) {
    return this.request(`/api/v1/categories/${categoryId}`, { method: 'DELETE' });
  }

  // System endpoints
  async healthCheck() {
    return this.request('/system/health', { method: 'GET' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types based on FastAPI schemas
export interface User {
  id: number;
  email: string;
  username?: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author_id: number;
  category_id?: number;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPVerifyResponse {
  message: string;
  access_token?: string;
  token_type?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  message: string;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
