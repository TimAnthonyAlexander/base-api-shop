<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
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

        // Enrich products with images
        $productsWithImages = [];
        foreach ($foundProducts as $foundProduct) {
            $product = Product::find($foundProduct['id']);
            if ($product instanceof Product) {
                $images = $product->images()->get();
                $imageUrls = [];
                foreach ($images as $image) {
                    if ($image instanceof ProductImage) {
                        $imageUrls[] = $image->image_path;
                    }
                }

                $productsWithImages[] = [
                    'id' => $product->id,
                    'title' => $product->title,
                    'description' => $product->description,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'views' => $product->views,
                    'images' => $imageUrls,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            }
        }

        Cache::put('product_search_' . md5($this->query), $productsWithImages, 300);

        return JsonResponse::ok([
            'products' => $productsWithImages,
            'query' => $this->query,
        ]);
    }
}
