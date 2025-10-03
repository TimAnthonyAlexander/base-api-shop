<?php

namespace App\Controllers;

use BaseApi\App;
use BaseApi\Cache\Cache;
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

        if (Cache::has('product_search_' . md5($this->query))) {
            return JsonResponse::ok([
                'products' => Cache::get('product_search_' . md5($this->query)),
                'query' => $this->query,
            ]);
        }

        $sql = 'SELECT * FROM `product` WHERE (`title` LIKE ? OR `description` LIKE ?) AND `stock` >= ?;';

        $foundProducts = App::connection()->query($sql, [
            '%' . $this->query . '%',
            '%' . $this->query . '%',
            1,
        ]);

        Cache::put('product_search_' . md5($this->query), $foundProducts, 300);

        return JsonResponse::ok([
            'products' => $foundProducts,
            'query' => $this->query,
        ]);
    }
}
