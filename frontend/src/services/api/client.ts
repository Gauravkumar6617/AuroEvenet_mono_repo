import useAuthStore from "../../store/useAuthStore";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getHeaders(
    options: RequestInit,
    includeApiKey: boolean = false,
    token?: string | null,
    includeAuth: boolean = true,
  ): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    if (!options.body || options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    if (includeApiKey) {
      headers["x-internal-api-key"] =
        (import.meta as any).env?.VITE_INTERNAL_API_KEY || "your-internal-api-key";
    }

    // Attach Bearer token if provided (fixes cross-origin cookie blocking)
    if (includeAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Auto-include token from auth store if available and no explicit token provided
    if (includeAuth && !token) {
      try {
        const storedToken = useAuthStore.getState().accessToken;
        if (storedToken) {
          headers["Authorization"] = `Bearer ${storedToken}`;
        }
      } catch {
        // Store might not be initialized yet, ignore
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeApiKey: boolean = false,
    token?: string | null,
    includeCredentials: boolean = true,
    includeAuth: boolean = true,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: this.getHeaders(options, includeApiKey, token, includeAuth),
      credentials: includeCredentials ? "include" : "omit",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
        // Don't log 401/403 as errors — those are normal auth states
        if (response.status !== 401 && response.status !== 403) {
          console.error("API request failed:", message);
        }
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const apiClientCore = new ApiClient();
