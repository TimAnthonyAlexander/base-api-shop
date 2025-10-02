// Generated TypeScript definitions for BaseApi
// Do not edit manually - regenerate with: ./mason types:generate

export type UUID = string;
export type Envelope<T> = { data: T };

export interface ErrorResponse {
  error: string;
  requestId: string;
  errors?: Record<string, string>;
}

export interface User {
  name: string;
  password: string;
  email: string;
  active: boolean;
  address: string;
  role: string;
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetProductByIdRequestPath {
  id: string;
}

export interface GetProductByIdRequestQuery {
  title?: string;
  description?: string;
  price: number;
  stock: number;
}

export type GetProductByIdResponse = Envelope<any>;

export interface PostProductRequestBody {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export type PostProductResponse = Envelope<any>;

export interface GetBasketRequestQuery {
  product_id: string;
  action?: string;
}

export type GetBasketResponse = Envelope<any>;

export interface PostBasketRequestBody {
  product_id?: string;
  action?: string;
}

export type PostBasketResponse = Envelope<any>;

export interface GetHealthRequestQuery {
  db?: string;
  cache?: string;
}

export type GetHealthResponse = Envelope<any>;

export interface PostSignupRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export type PostSignupResponse = Envelope<any>;

export interface PostLoginRequestBody {
  email?: string;
  password?: string;
}

export type PostLoginResponse = Envelope<any>;

export type PostLogoutResponse = Envelope<any>;

export type GetMeResponse = Envelope<any>;

export type PostFileUploadResponse = Envelope<any>;

export type GetFileUploadResponse = Envelope<any>;

export type DeleteFileUploadResponse = Envelope<any>;

export type GetOpenApiResponse = Envelope<any>;
