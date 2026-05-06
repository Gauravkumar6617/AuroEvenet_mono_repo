export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role?: string;
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
  token_type: string;
  message: string;
  email?: string;
  username?: string;
}

export interface OTPVerifyResponse {
  message: string;
  success: boolean;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
