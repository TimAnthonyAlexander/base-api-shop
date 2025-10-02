<?php

namespace App\Controllers;

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
        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        return JsonResponse::ok([
            'product' => $product,
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
