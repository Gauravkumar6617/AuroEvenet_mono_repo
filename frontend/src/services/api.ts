// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Client
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getHeaders(includeApiKey: boolean = false): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    // Add internal API key for posts and categories endpoints
    if (includeApiKey) {
      headers['x-internal-api-key'] = import.meta.env.VITE_INTERNAL_API_KEY || 'your-internal-api-key';
    }

    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeApiKey: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: this.getHeaders(includeApiKey),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
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
    username: string;
    password: string;
    oauth_provider?: string;
    oauth_id?: string;
  }) {
    return this.request<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string; user_Agent?: string }) {
    return this.request<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyEmail(token: string) {
    return this.request<string>(`/api/v1/auth/verify?token=${token}`, {
      method: 'GET',
    });
  }

  async verifyOTP(data: { email: string; otp: string }) {
    return this.request<OTPVerifyResponse>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendOTP(email: string) {
    return this.request<string>(`/api/v1/auth/resend-otp?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
  }

  async googleCallback(code: string) {
    return this.request<any>(`/api/v1/auth/google/callback?code=${code}`, {
      method: 'GET',
    });
  }

  async githubCallback(code: string) {
    return this.request<any>(`/api/v1/auth/github/callback?code=${code}`, {
      method: 'GET',
    });
  }

  // Posts endpoints
  async createPost(postData: {
    title: string;
    content: string;
    category_id: number;
    tags?: string;
    thumbnail: string;
  }) {
    // Convert to FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('category_id', postData.category_id.toString());
    if (postData.tags) formData.append('tags', postData.tags);
    formData.append('thumbnail', postData.thumbnail);

    return this.request<Post>('/api/v1/posts/', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set multipart headers
    }, true); // Include API key
  }

  async getAllPosts(params?: any) {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<Post[]>(`/api/v1/posts/${queryParams}`, {
      method: 'GET',
    }, true); // Include API key
  }

  async getPostById(postId: number) {
    return this.request<Post>(`/api/v1/posts/${postId}`, {
      method: 'GET',
    });
  }

  async getPostBySlug(slug: string) {
    return this.request<Post>(`/api/v1/posts/slug/${slug}`, {
      method: 'GET',
    });
  }

  async deletePost(postId: number) {
    return this.request<string>(`/api/v1/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints
  async createCategory(categoryData: { name: string; slug: string }) {
    return this.request<Category>('/api/v1/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async getAllCategories() {
    return this.request<Category[]>('/api/v1/categories/', {
      method: 'GET',
    }, true); // Include API key
  }

  async getCategoryById(categoryId: number) {
    return this.request<Category>(`/api/v1/categories/${categoryId}`, {
      method: 'POST', // Backend uses POST for this endpoint
    });
  }

  async deleteCategory(categoryId: number) {
    return this.request<string>(`/api/v1/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // System endpoints
  async healthCheck() {
    return this.request<{ status: string }>('/system/health', {
      method: 'GET',
    });
  }
}

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  oauth_provider?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  slug: string;
  thumbnail_url: string;
  is_active: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  author_id: number;
  created_at: string;
  tags: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface RegisterResponse {
  user: User;
  verification_token?: string;
  message: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  message: string;
}

export interface OTPVerifyResponse {
  message: string;
  success: boolean;
  access_token?: string;
  refresh_token?: string;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// Export singleton instance
export const apiClient = new ApiClient();
