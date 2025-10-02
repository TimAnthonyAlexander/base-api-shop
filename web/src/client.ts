// Generated API client functions for Shop
// Do not edit manually - regenerate with: ./mason types:generate

import { http, HttpOptions } from './http';
import { buildPath } from './routes';
import * as Types from './types';

/**
 * GET /product/{id}
 * @tags API
 */
export async function getProductById(path: Types.GetProductByIdPathParams, query?: Types.GetProductByIdQueryParams, options?: HttpOptions): Promise<Types.GetProductByIdResponse> {
  const url = buildPath('GetProductById', path);
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * POST /product
 * @tags API
 */
export async function postProduct(body: Types.PostProductRequestBody, options?: HttpOptions): Promise<Types.PostProductResponse> {
  const url = '/product';

  return http.post(url, body, options);
}

/**
 * GET /basket
 * @tags API
 */
export async function getBasket(query?: Types.GetBasketQueryParams, options?: HttpOptions): Promise<Types.GetBasketResponse> {
  const url = '/basket';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * POST /basket
 * @tags API
 */
export async function postBasket(body: Types.PostBasketRequestBody, options?: HttpOptions): Promise<Types.PostBasketResponse> {
  const url = '/basket';

  return http.post(url, body, options);
}

/**
 * GET /orders
 * @tags API
 */
export async function getOrder(query?: Types.GetOrderQueryParams, options?: HttpOptions): Promise<Types.GetOrderResponse> {
  const url = '/orders';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * GET /order/{id}
 * @tags API
 */
export async function getOrderById(path: Types.GetOrderByIdPathParams, options?: HttpOptions): Promise<Types.GetOrderByIdResponse> {
  const url = buildPath('GetOrderById', path);

  return http.get(url, options);
}

/**
 * POST /order
 * @tags API
 */
export async function postOrder(body: Types.PostOrderRequestBody, options?: HttpOptions): Promise<Types.PostOrderResponse> {
  const url = '/order';

  return http.post(url, body, options);
}

/**
 * GET /checkout/success
 * @tags API
 */
export async function getCheckoutSuccess(query?: Types.GetCheckoutSuccessQueryParams, options?: HttpOptions): Promise<Types.GetCheckoutSuccessResponse> {
  const url = '/checkout/success';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * GET /checkout/cancel
 * @tags API
 */
export async function getCheckoutCancel(query?: Types.GetCheckoutCancelQueryParams, options?: HttpOptions): Promise<Types.GetCheckoutCancelResponse> {
  const url = '/checkout/cancel';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * GET /health
 * @tags API
 */
export async function getHealth(query?: Types.GetHealthQueryParams, options?: HttpOptions): Promise<Types.GetHealthResponse> {
  const url = '/health';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * POST /auth/signup
 * @tags Authentication
 */
export async function postSignup(body: Types.PostSignupRequestBody, options?: HttpOptions): Promise<Types.PostSignupResponse> {
  const url = '/auth/signup';

  return http.post(url, body, options);
}

/**
 * POST /auth/login
 * @tags Authentication
 */
export async function postLogin(body: Types.PostLoginRequestBody, options?: HttpOptions): Promise<Types.PostLoginResponse> {
  const url = '/auth/login';

  return http.post(url, body, options);
}

/**
 * POST /auth/logout
 * @tags Authentication
 */
export async function postLogout(options?: HttpOptions): Promise<Types.PostLogoutResponse> {
  const url = '/auth/logout';

  return http.post(url, options);
}

/**
 * GET /me
 * @tags Authentication
 */
export async function getMe(query?: Types.GetMeQueryParams, options?: HttpOptions): Promise<Types.GetMeResponse> {
  const url = '/me';
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }
  const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

  return http.get(fullUrl, options);
}

/**
 * POST /me
 * @tags Authentication
 */
export async function postMe(body: Types.PostMeRequestBody, options?: HttpOptions): Promise<Types.PostMeResponse> {
  const url = '/me';

  return http.post(url, body, options);
}

/**
 * POST /files/upload
 * @tags Files
 */
export async function postFileUpload(options?: HttpOptions): Promise<Types.PostFileUploadResponse> {
  const url = '/files/upload';

  return http.post(url, options);
}

/**
 * GET /files/info
 * @tags Files
 */
export async function getFileUpload(options?: HttpOptions): Promise<Types.GetFileUploadResponse> {
  const url = '/files/info';

  return http.get(url, options);
}

/**
 * DELETE /files
 * @tags Files
 */
export async function deleteFileUpload(options?: HttpOptions): Promise<Types.DeleteFileUploadResponse> {
  const url = '/files';

  return http.delete(url, options);
}

/**
 * GET /openapi.json
 * @tags API
 */
export async function getOpenApi(options?: HttpOptions): Promise<Types.GetOpenApiResponse> {
  const url = '/openapi.json';

  return http.get(url, options);
}
