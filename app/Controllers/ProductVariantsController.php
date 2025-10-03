<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * ProductVariantsController
 * 
 * Handles fetching product variants based on variant_group
 */
class ProductVariantsController extends Controller
{
    public string $id = '';

    public function get(): JsonResponse
    {
        if ($this->id === '') {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        // If no variant group, return empty array
        if ($product->variant_group === null || $product->variant_group === '') {
            return JsonResponse::ok([
                'variants' => [],
            ]);
        }

        // Find all products with the same variant_group
        $allProducts = Product::all();
        $variants = [];

        foreach ($allProducts as $allProduct) {
            if ($allProduct instanceof Product 
                && $allProduct->variant_group === $product->variant_group
                && $allProduct->id !== $product->id) {
                
                // Get first image
                $images = $allProduct->images()->get();
                $imageUrl = null;
                if ($images !== [] && $images[0] instanceof ProductImage) {
                    $imageUrl = $images[0]->image_path;
                }

                // Get key attributes (Color, Size, Material)
                $attributes = $allProduct->attributes()->get();
                $variantAttributes = [];
                foreach ($attributes as $attribute) {
                    if (!$attribute instanceof ProductAttribute) {
                        continue;
                    }

                    // Only include key differentiating attributes
                    if (!in_array($attribute->attribute, ['Color', 'Size', 'Material', 'Storage', 'Capacity'])) {
                        continue;
                    }

                    $variantAttributes[$attribute->attribute] = $attribute->value;
                }

                $variants[] = [
                    'id' => $allProduct->id,
                    'title' => $allProduct->title,
                    'price' => $allProduct->price,
                    'stock' => $allProduct->stock,
                    'image' => $imageUrl,
                    'attributes' => $variantAttributes,
                ];
            }
        }

        return JsonResponse::ok([
            'variants' => $variants,
        ]);
    }
}

