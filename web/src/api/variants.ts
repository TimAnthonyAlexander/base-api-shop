import { http, type HttpOptions } from '../http';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  stock: number;
  image: string | null;
  attributes: Record<string, string>;
}

export interface GetProductVariantsResponse {
  success: boolean;
  data: {
    variants: ProductVariant[];
  };
}

export async function getProductVariants(
  productId: string,
  options?: HttpOptions
): Promise<GetProductVariantsResponse> {
  return http.get<GetProductVariantsResponse>(`/product/${productId}/variants`, options);
}

