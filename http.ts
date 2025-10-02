// Generated HTTP client for Shop
// Do not edit manually - regenerate with: ./mason types:generate

export interface HttpOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public requestId?: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = 'http://127.0.0.1:8822';

async function fetchApi<T>(
  path: string,
  method: string,
  options?: HttpOptions & { body?: unknown }
): Promise<T> {
  const url = BASE_URL + path;
  
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Request failed',
      response.status,
      data.requestId,
      data.errors
    );
  }

  return data;
}

export const http = {
  get: <T>(path: string, options?: HttpOptions) => 
    fetchApi<T>(path, 'GET', options),
  
  post: <T>(path: string, body: unknown, options?: HttpOptions) => 
    fetchApi<T>(path, 'POST', { ...options, body }),
  
  put: <T>(path: string, body: unknown, options?: HttpOptions) => 
    fetchApi<T>(path, 'PUT', { ...options, body }),
  
  patch: <T>(path: string, body: unknown, options?: HttpOptions) => 
    fetchApi<T>(path, 'PATCH', { ...options, body }),
  
  delete: <T>(path: string, options?: HttpOptions) => 
    fetchApi<T>(path, 'DELETE', options),
};