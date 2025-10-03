<?php

namespace App\Controllers;

use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * ProductRecommendationsController
 * 
 * Get recommended products for the homepage
 */
class ProductRecommendationsController extends Controller
{
    public int $limit = 6;

    public function get(): JsonResponse
    {
        $allProducts = Product::cached()->where('stock', '>=', 1)->orderBy('views', 'desc')->limit($this->limit)->get();

        return JsonResponse::ok([
            'products' => $allProducts,
            'limit' => $this->limit,
        ]);
    }
}
