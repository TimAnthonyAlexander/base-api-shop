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
        // Get all products, shuffle for "recommendations"
        $allProducts = Product::all();
        
        // Shuffle for variety
        shuffle($allProducts);
        
        // Limit the results
        $recommendations = array_slice($allProducts, 0, $this->limit);

        return JsonResponse::ok([
            'products' => $recommendations,
            'limit' => $this->limit,
        ]);
    }
}

