// Generated HTTP client for Shop
// Do not edit manually - regenerate with: ./mason types:generate

export interface HttpOptions {
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

export class ApiError extends Error {
    status: number;
    requestId?: string;
    errors?: Record<string, string>;

    constructor(
        message: string,
        status: number,
        requestId?: string,
        errors?: Record<string, string>
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.requestId = requestId;
        this.errors = errors;
    }
}

export const BASE_URL =
    import.meta.env.MODE === 'production'
        ? 'https://shop-api.timanthonyalexander.de'
        : 'http://127.0.0.1:8822';

/**
 * Convert a relative image path to a full API URL
 * @param path - Relative path like "storage/products/image.jpg"
 * @returns Full URL to the image on the API server
 */
export function getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    // If it's already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
}

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

    // Handle 204 No Content and HEAD requests
    if (response.status === 204 || method === 'HEAD') {
        if (!response.ok) {
            throw new ApiError('Request failed', response.status);
        }
        return undefined as T;
    }

    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
        data = isJson ? await response.json() : await response.text();
    } catch (err) {
        // Failed to parse response
        if (!response.ok) {
            throw new ApiError('Request failed', response.status);
        }
        throw new ApiError('Failed to parse response', response.status);
    }

    if (!response.ok) {
        // Handle error responses
        if (typeof data === 'object' && data !== null) {
            throw new ApiError(
                data.error || 'Request failed',
                response.status,
                data.requestId,
                data.errors
            );
        } else {
            throw new ApiError(
                typeof data === 'string' ? data : 'Request failed',
                response.status
            );
        }
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

    head: <T>(path: string, options?: HttpOptions) =>
        fetchApi<T>(path, 'HEAD', options),

    options: <T>(path: string, options?: HttpOptions) =>
        fetchApi<T>(path, 'OPTIONS', options),
};
