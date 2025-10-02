// Generated route constants and path builder for Shop
// Do not edit manually - regenerate with: ./mason types:generate

export const Routes = {
  GetProductById: '/product/{id}',
  PostProduct: '/product',
  GetBasket: '/basket',
  PostBasket: '/basket',
  GetOrder: '/orders',
  GetOrderById: '/order/{id}',
  PostOrder: '/order',
  GetCheckoutSuccess: '/checkout/success',
  GetCheckoutCancel: '/checkout/cancel',
  GetHealth: '/health',
  PostSignup: '/auth/signup',
  PostLogin: '/auth/login',
  PostLogout: '/auth/logout',
  GetMe: '/me',
  PostMe: '/me',
  PostFileUpload: '/files/upload',
  GetFileUpload: '/files/info',
  DeleteFileUpload: '/files',
  GetOpenApi: '/openapi.json',
} as const;

export type RouteKey = keyof typeof Routes;

/**
 * Build a path from a route key and parameters
 * @param key - The route key
 * @param params - Path parameters to substitute
 * @returns The built path
 */
export function buildPath<K extends RouteKey>(
  key: K,
  params?: Record<string, string | number>
): string {
  let path = Routes[key];

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      path = path.replace(`{${paramKey}}`, encodeURIComponent(String(paramValue)));
    }
  }

  return path;
}

// Type-safe path builders for each route

export function buildGetProductByIdPath(params: { id: string | number }): string {
  return buildPath('GetProductById', params);
}

export function buildGetOrderByIdPath(params: { id: string | number }): string {
  return buildPath('GetOrderById', params);
}
