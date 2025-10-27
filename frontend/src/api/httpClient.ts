/**
 * Centralized HTTP client for all API requests.
 * 
 * Benefits:
 * - Single place to configure base URL, headers, auth
 * - Consistent error handling across all requests
 * - Easy to add interceptors (logging, retry logic)
 * - Testable: can mock this module
 * 
 * Production enhancements:
 * - Add auth token injection from localStorage/cookie
 * - Add request/response interceptors
 * - Add retry logic with exponential backoff
 * - Add request cancellation (AbortController)
 */

const BASE_URL = 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * Make an HTTP request with consistent error handling.
 */
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = 10000, ...fetchConfig } = config;

  const url = `${BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = new Headers(fetchConfig.headers);
  if (!headers.has('Content-Type') && fetchConfig.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // TODO: In production, inject auth token here
  // const token = getAuthToken();
  // if (token) {
  //   headers.set('Authorization', `Bearer ${token}`);
  // }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(`Network error: ${error.message}`, 0);
    }
    
    throw new ApiError('Unknown error occurred', 0);
  }
}

export const httpClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};