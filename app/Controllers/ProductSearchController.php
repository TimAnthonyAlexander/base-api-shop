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

        $foundProducts = Product::whereConditions([
            ['column' => 'title', 'operator' => 'LIKE', 'value' => '%' . $this->query . '%'],
            ['column' => 'description', 'operator' => 'LIKE', 'value' => '%' . $this->query . '%'],
        ], true)->get();

        return JsonResponse::ok([
            'products' => $foundProducts,
            'query' => $this->query,
        ]);
    }
}
