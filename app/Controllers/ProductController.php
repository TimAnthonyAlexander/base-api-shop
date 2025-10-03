<?php

namespace App\Controllers;

use App\Models\ProductImage;
use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * ProductController
 * 
 * Add your controller description here.
 */
class ProductController extends Controller
{
    public string $id = '';

    public string $title = '';

    public ?string $description = null;

    public float $price;

    public int $stock;

    public function get(): JsonResponse
    {
        // If ID is provided, get single product
        if ($this->id !== '') {
            $product = Product::find($this->id);

            if (!$product instanceof Product) {
                return JsonResponse::notFound('Product not found');
            }

            $product->views += 1;
            $product->save();

            // Get product images
            $images = $product->images()->get();
            $imageUrls = [];
            foreach ($images as $image) {
                if ($image instanceof ProductImage) {
                    $imageUrls[] = $image->image_path;
                }
            }

            $productData = [
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

            return JsonResponse::ok([
                'product' => $productData,
            ]);
        }

        // Otherwise, list all products with images
        $products = Product::all();
        $productsWithImages = [];

        foreach ($products as $product) {
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

        return JsonResponse::ok([
            'products' => $productsWithImages,
        ]);
    }

    public function post(): JsonResponse
    {
        if ($this->request->user['role'] !== 'admin') {
            return JsonResponse::forbidden('Only admins can create products');
        }

        $this->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = new Product();
        $product->title = $this->title;
        $product->description = $this->description;
        $product->price = $this->price;
        $product->stock = $this->stock;
        $product->save();

        return JsonResponse::created([
            'product' => $product,
        ]);
    }
}
