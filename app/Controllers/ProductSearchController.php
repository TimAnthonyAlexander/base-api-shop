<?php

namespace App\Controllers;

use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * ProductSearchController
 * 
 * Search through products by title and description
 */
class ProductSearchController extends Controller
{
    public string $query = '';

    public function get(): JsonResponse
    {
        if ($this->query === '') {
            return JsonResponse::ok([
                'products' => [],
                'query' => '',
            ]);
        }

        // Get all products and filter by search query
        $allProducts = Product::all();
        $searchQuery = strtolower($this->query);

        $filteredProducts = array_filter($allProducts, function ($product) use ($searchQuery): bool {
            $titleMatch = str_contains(strtolower($product->title ?? ''), $searchQuery);
            $descriptionMatch = str_contains(strtolower($product->description ?? ''), $searchQuery);
            
            return $titleMatch || $descriptionMatch;
        });

        return JsonResponse::ok([
            'products' => array_values($filteredProducts),
            'query' => $this->query,
        ]);
    }
}

