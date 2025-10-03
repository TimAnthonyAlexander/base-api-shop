<?php

namespace App\Controllers;

use App\Models\ProductImage;
use App\Models\Product;
use BaseApi\Cache\Cache;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * ProductRecommendationsController
 * 
 * Get recommended products for the homepage
 */
class ProductRecommendationsController extends Controller
{
    public int $limit = 100;

    public function get(): JsonResponse
    {
        if (Cache::has('product_recommendations')) {
            return JsonResponse::ok(Cache::get('product_recommendations'));
        }

        $allProducts = Product::cached()->where('stock', '>=', 1)->orderBy('views', 'desc')->limit($this->limit)->get();

        $productsWithImages = [];
        foreach ($allProducts as $allProduct) {
            if ($allProduct instanceof Product) {
                $images = $allProduct->images()->get();
                $imageUrls = [];
                foreach ($images as $image) {
                    if ($image instanceof ProductImage) {
                        $imageUrls[] = $image->image_path;
                    }
                }

                $productsWithImages[] = [
                    'id' => $allProduct->id,
                    'title' => $allProduct->title,
                    'description' => $allProduct->description,
                    'price' => $allProduct->price,
                    'stock' => $allProduct->stock,
                    'views' => $allProduct->views,
                    'images' => $imageUrls,
                    'created_at' => $allProduct->created_at,
                    'updated_at' => $allProduct->updated_at,
                ];
            }
        }

        Cache::put('product_recommendations', [
            'products' => $productsWithImages,
            'limit' => $this->limit,
        ], 3600);

        return JsonResponse::ok([
            'products' => $productsWithImages,
            'limit' => $this->limit,
        ]);
    }
}
