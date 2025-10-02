// Generated React hooks for Shop
// Do not edit manually - regenerate with: ./mason types:generate

import { useState, useEffect, useCallback, DependencyList } from 'react';
import { HttpOptions } from './http';
import * as Api from './client';
import * as Types from './types';

export interface QueryOptions<T> extends HttpOptions {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface MutationResult<T, TVariables> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (variables: TVariables) => Promise<T>;
  reset: () => void;
}

/**
 * React hook for GET /product/{id}
 * Auto-fetches on mount and when dependencies change
 */
export function useGetProductById(path: Types.GetProductByIdPathParams, query?: Types.GetProductByIdQueryParams, options?: QueryOptions<Types.GetProductByIdResponse>, deps?: DependencyList): QueryResult<Types.GetProductByIdResponse> {
  const [data, setData] = useState<Types.GetProductByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getProductById(path, query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for POST /product
 * Returns a mutate function that must be called manually
 */
export function usePostProduct(
  options?: QueryOptions<Types.PostProductResponse>
): MutationResult<Types.PostProductResponse, {body: Types.PostProductRequestBody}> {
  const [data, setData] = useState<Types.PostProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {body: Types.PostProductRequestBody}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postProduct(variables.body, options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /basket
 * Auto-fetches on mount and when dependencies change
 */
export function useGetBasket(query?: Types.GetBasketQueryParams, options?: QueryOptions<Types.GetBasketResponse>, deps?: DependencyList): QueryResult<Types.GetBasketResponse> {
  const [data, setData] = useState<Types.GetBasketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getBasket(query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for POST /basket
 * Returns a mutate function that must be called manually
 */
export function usePostBasket(
  options?: QueryOptions<Types.PostBasketResponse>
): MutationResult<Types.PostBasketResponse, {body: Types.PostBasketRequestBody}> {
  const [data, setData] = useState<Types.PostBasketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {body: Types.PostBasketRequestBody}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postBasket(variables.body, options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /orders
 * Auto-fetches on mount and when dependencies change
 */
export function useGetOrder(query?: Types.GetOrderQueryParams, options?: QueryOptions<Types.GetOrderResponse>, deps?: DependencyList): QueryResult<Types.GetOrderResponse> {
  const [data, setData] = useState<Types.GetOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getOrder(query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for GET /order/{id}
 * Auto-fetches on mount and when dependencies change
 */
export function useGetOrderById(path: Types.GetOrderByIdPathParams, options?: QueryOptions<Types.GetOrderByIdResponse>, deps?: DependencyList): QueryResult<Types.GetOrderByIdResponse> {
  const [data, setData] = useState<Types.GetOrderByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getOrderById(path, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for POST /order
 * Returns a mutate function that must be called manually
 */
export function usePostOrder(
  options?: QueryOptions<Types.PostOrderResponse>
): MutationResult<Types.PostOrderResponse, {body: Types.PostOrderRequestBody}> {
  const [data, setData] = useState<Types.PostOrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {body: Types.PostOrderRequestBody}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postOrder(variables.body, options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /checkout/success
 * Auto-fetches on mount and when dependencies change
 */
export function useGetCheckoutSuccess(query?: Types.GetCheckoutSuccessQueryParams, options?: QueryOptions<Types.GetCheckoutSuccessResponse>, deps?: DependencyList): QueryResult<Types.GetCheckoutSuccessResponse> {
  const [data, setData] = useState<Types.GetCheckoutSuccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getCheckoutSuccess(query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for GET /checkout/cancel
 * Auto-fetches on mount and when dependencies change
 */
export function useGetCheckoutCancel(query?: Types.GetCheckoutCancelQueryParams, options?: QueryOptions<Types.GetCheckoutCancelResponse>, deps?: DependencyList): QueryResult<Types.GetCheckoutCancelResponse> {
  const [data, setData] = useState<Types.GetCheckoutCancelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getCheckoutCancel(query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for GET /health
 * Auto-fetches on mount and when dependencies change
 */
export function useGetHealth(query?: Types.GetHealthQueryParams, options?: QueryOptions<Types.GetHealthResponse>, deps?: DependencyList): QueryResult<Types.GetHealthResponse> {
  const [data, setData] = useState<Types.GetHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getHealth(query, options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for POST /auth/signup
 * Returns a mutate function that must be called manually
 */
export function usePostSignup(
  options?: QueryOptions<Types.PostSignupResponse>
): MutationResult<Types.PostSignupResponse, {body: Types.PostSignupRequestBody}> {
  const [data, setData] = useState<Types.PostSignupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {body: Types.PostSignupRequestBody}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postSignup(variables.body, options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for POST /auth/login
 * Returns a mutate function that must be called manually
 */
export function usePostLogin(
  options?: QueryOptions<Types.PostLoginResponse>
): MutationResult<Types.PostLoginResponse, {body: Types.PostLoginRequestBody}> {
  const [data, setData] = useState<Types.PostLoginResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {body: Types.PostLoginRequestBody}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postLogin(variables.body, options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for POST /auth/logout
 * Returns a mutate function that must be called manually
 */
export function usePostLogout(
  options?: QueryOptions<Types.PostLogoutResponse>
): MutationResult<Types.PostLogoutResponse, {}> {
  const [data, setData] = useState<Types.PostLogoutResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postLogout(options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /me
 * Auto-fetches on mount and when dependencies change
 */
export function useGetMe(options?: QueryOptions<Types.GetMeResponse>, deps?: DependencyList): QueryResult<Types.GetMeResponse> {
  const [data, setData] = useState<Types.GetMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getMe(options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for POST /files/upload
 * Returns a mutate function that must be called manually
 */
export function usePostFileUpload(
  options?: QueryOptions<Types.PostFileUploadResponse>
): MutationResult<Types.PostFileUploadResponse, {}> {
  const [data, setData] = useState<Types.PostFileUploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.postFileUpload(options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /files/info
 * Auto-fetches on mount and when dependencies change
 */
export function useGetFileUpload(options?: QueryOptions<Types.GetFileUploadResponse>, deps?: DependencyList): QueryResult<Types.GetFileUploadResponse> {
  const [data, setData] = useState<Types.GetFileUploadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getFileUpload(options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * React hook for DELETE /files
 * Returns a mutate function that must be called manually
 */
export function useDeleteFileUpload(
  options?: QueryOptions<Types.DeleteFileUploadResponse>
): MutationResult<Types.DeleteFileUploadResponse, {}> {
  const [data, setData] = useState<Types.DeleteFileUploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.deleteFileUpload(options);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}

/**
 * React hook for GET /openapi.json
 * Auto-fetches on mount and when dependencies change
 */
export function useGetOpenApi(options?: QueryOptions<Types.GetOpenApiResponse>, deps?: DependencyList): QueryResult<Types.GetOpenApiResponse> {
  const [data, setData] = useState<Types.GetOpenApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await Api.getOpenApi(options);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ...(deps || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
