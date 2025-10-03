// Generated TypeScript definitions for Shop
// Do not edit manually - regenerate with: ./mason types:generate

export type UUID = string;
export type Envelope<T> = { data: T };

export interface ErrorResponse {
  error: string;
  requestId: string;
  errors?: Record<string, string>;
}

export interface User {
  name?: string;
  password?: string;
  email?: string;
  active?: boolean;
  address?: string;
  role?: string;
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface GetProductByIdPathParams {
  id: string;
  [key: string]: string | number | null;
}

export interface GetProductByIdQueryParams {
  title?: string;
  description?: string | null;
  price: number;
  stock: number;
}

export type GetProductByIdResponse = Envelope<unknown>;

export interface PostProductRequestBody {
  id?: string;
  title?: string;
  description?: string | null;
  price: number;
  stock: number;
}

export type PostProductResponse = Envelope<unknown>;

export interface GetBasketQueryParams {
  product_id: string;
  action?: string;
}

export type GetBasketResponse = Envelope<unknown>;

export interface PostBasketRequestBody {
  product_id: string;
  action?: string;
}

export type PostBasketResponse = Envelope<unknown>;

export interface GetOrderQueryParams {
  id?: string | null;
}

export type GetOrderResponse = Envelope<unknown>;

export interface GetOrderByIdPathParams {
  id: string | null;
  [key: string]: string | number | null;
}

export type GetOrderByIdResponse = Envelope<unknown>;

export interface PostOrderRequestBody {
  id?: string | null;
}

export type PostOrderResponse = Envelope<unknown>;

export interface GetCheckoutSuccessQueryParams {
  session_id: string;
  basket_id: string;
}

export type GetCheckoutSuccessResponse = Envelope<unknown>;

export interface GetCheckoutCancelQueryParams {
  basket_id: string;
}

export type GetCheckoutCancelResponse = Envelope<unknown>;

export interface GetHealthQueryParams {
  db?: string;
  cache?: string;
}

export type GetHealthResponse = Envelope<unknown>;

export interface PostSignupRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export type PostSignupResponse = Envelope<User>;

export interface PostLoginRequestBody {
  email?: string;
  password?: string;
}

export type PostLoginResponse = Envelope<{ user: unknown[] }>;

export type PostLogoutResponse = Envelope<{ message: string }>;

export interface GetMeQueryParams {
  name?: string;
  email?: string;
  address?: string;
}

export type GetMeResponse = Envelope<{ user: unknown[] }>;

export interface PostMeRequestBody {
  name?: string;
  email?: string;
  address?: string;
}

export type PostMeResponse = Envelope<unknown>;

export type PostFileUploadResponse = Envelope<{ path: string; url: string; size: number; type: string }>;

export type GetFileUploadResponse = Envelope<unknown>;

export type DeleteFileUploadResponse = Envelope<unknown>;

export type GetOpenApiResponse = Envelope<unknown>;
