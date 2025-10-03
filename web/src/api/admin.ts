import { http, type HttpOptions } from '../http';
import { type ThemeName } from '../themes';

// ============================================
// Theme Management
// ============================================

export interface GetAdminThemeResponse {
  success: boolean;
  data: {
    theme: ThemeName;
  };
}

export interface PostAdminThemeResponse {
  success: boolean;
  data: {
    theme: ThemeName;
  };
  message: string;
}

export interface PostAdminThemeBody {
  theme: ThemeName;
}

export async function getAdminTheme(options?: HttpOptions): Promise<GetAdminThemeResponse> {
  return http.get<GetAdminThemeResponse>('/admin/theme', options);
}

export async function postAdminTheme(
  body: PostAdminThemeBody,
  options?: HttpOptions
): Promise<PostAdminThemeResponse> {
  return http.post<PostAdminThemeResponse>('/admin/theme', body, options);
}

// ============================================
// Product Management
// ============================================

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  views: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface GetAdminProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    per_page: number;
  };
}

export interface GetAdminProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export interface CreateProductBody {
  title: string;
  description?: string | null;
  price: number;
  stock: number;
}

export interface UpdateProductBody {
  title?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export interface DeleteProductResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export async function getAdminProducts(
  params?: { page?: number; per_page?: number },
  options?: HttpOptions
): Promise<GetAdminProductsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.per_page) query.append('per_page', String(params.per_page));
  const url = query.toString() ? `/admin/products?${query}` : '/admin/products';
  return http.get<GetAdminProductsResponse>(url, options);
}

export async function getAdminProduct(
  id: string,
  options?: HttpOptions
): Promise<GetAdminProductResponse> {
  return http.get<GetAdminProductResponse>(`/admin/product/${id}`, options);
}

export async function createAdminProduct(
  body: CreateProductBody,
  options?: HttpOptions
): Promise<ProductResponse> {
  return http.post<ProductResponse>('/admin/product', body, options);
}

export async function updateAdminProduct(
  id: string,
  body: UpdateProductBody,
  options?: HttpOptions
): Promise<ProductResponse> {
  return http.put<ProductResponse>(`/admin/product/${id}`, body, options);
}

export async function deleteAdminProduct(
  id: string,
  options?: HttpOptions
): Promise<DeleteProductResponse> {
  return http.delete<DeleteProductResponse>(`/admin/product/${id}`, options);
}

export interface UploadImageResponse {
  success: boolean;
  data: {
    image: {
      id: string;
      image_path: string;
      created_at: string;
    };
  };
}

export async function uploadProductImage(
  productId: string,
  file: File,
  options?: HttpOptions
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('image', file);
  
  return http.post<UploadImageResponse>(`/admin/product/${productId}/image`, formData, {
    ...options,
    headers: {
      ...options?.headers,
      // Let browser set Content-Type with boundary for FormData
    },
  });
}

export interface DeleteImageResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export async function deleteProductImage(
  imageId: string,
  options?: HttpOptions
): Promise<DeleteImageResponse> {
  return http.delete<DeleteImageResponse>(`/admin/product/image/${imageId}`, options);
}

// ============================================
// Order Management
// ============================================

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    images: string[];
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface GetAdminOrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    page: number;
    per_page: number;
  };
}

export interface GetAdminOrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export interface UpdateOrderBody {
  status: 'pending' | 'completed' | 'cancelled' | 'fulfilled';
}

export interface UpdateOrderResponse {
  success: boolean;
  data: {
    order: Order;
    message: string;
  };
}

export async function getAdminOrders(
  params?: { page?: number; per_page?: number; status?: string },
  options?: HttpOptions
): Promise<GetAdminOrdersResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.per_page) query.append('per_page', String(params.per_page));
  if (params?.status) query.append('status', params.status);
  const url = query.toString() ? `/admin/orders?${query}` : '/admin/orders';
  return http.get<GetAdminOrdersResponse>(url, options);
}

export async function getAdminOrder(
  id: string,
  options?: HttpOptions
): Promise<GetAdminOrderResponse> {
  return http.get<GetAdminOrderResponse>(`/admin/order/${id}`, options);
}

export async function updateAdminOrder(
  id: string,
  body: UpdateOrderBody,
  options?: HttpOptions
): Promise<UpdateOrderResponse> {
  return http.put<UpdateOrderResponse>(`/admin/order/${id}`, body, options);
}

// ============================================
// Analytics
// ============================================

export interface AnalyticsResponse {
  success: boolean;
  data: {
    total_sales: number;
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
  };
}

export async function getAdminAnalytics(options?: HttpOptions): Promise<AnalyticsResponse> {
  return http.get<AnalyticsResponse>('/admin/analytics', options);
}
