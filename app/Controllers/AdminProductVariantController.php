<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminProductVariantController extends Controller
{
    public ?string $id = null;

    public string $title = '';

    public ?string $description = null;

    public float $price = 0.0;

    public int $stock = 0;

    /**
     * Get all variants for a product
     */
    #[ResponseType(['variants' => 'array'])]
    public function get(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        if ($product->variant_group === null || $product->variant_group === '') {
            return JsonResponse::ok(['variants' => []]);
        }

        // Find all products with the same variant_group
        $allProducts = Product::all();
        $variants = [];

        foreach ($allProducts as $allProduct) {
            if ($allProduct instanceof Product 
                && $allProduct->variant_group === $product->variant_group) {
                
                // Get images
                $images = $allProduct->images()->get();
                $imageData = [];
                foreach ($images as $image) {
                    if ($image instanceof ProductImage) {
                        $imageData[] = [
                            'id' => $image->id,
                            'path' => $image->image_path,
                        ];
                    }
                }

                // Get attributes
                $attributes = $allProduct->attributes()->get();
                $attributesData = [];
                foreach ($attributes as $attribute) {
                    if ($attribute instanceof ProductAttribute) {
                        $attributesData[] = [
                            'id' => $attribute->id,
                            'attribute' => $attribute->attribute,
                            'value' => $attribute->value,
                        ];
                    }
                }

                $variants[] = [
                    'id' => $allProduct->id,
                    'title' => $allProduct->title,
                    'description' => $allProduct->description,
                    'price' => $allProduct->price,
                    'stock' => $allProduct->stock,
                    'views' => $allProduct->views,
                    'variant_group' => $allProduct->variant_group,
                    'images' => $imageData,
                    'attributes' => $attributesData,
                    'created_at' => $allProduct->created_at,
                    'updated_at' => $allProduct->updated_at,
                ];
            }
        }

        return JsonResponse::ok(['variants' => $variants]);
    }

    /**
     * Create a new variant based on an existing product
     */
    #[ResponseType(['product' => 'array'])]
    public function post(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $sourceProduct = Product::find($this->id);

        if (!$sourceProduct instanceof Product) {
            return JsonResponse::notFound('Source product not found');
        }

        // If source product doesn't have a variant group, create one
        if ($sourceProduct->variant_group === null || $sourceProduct->variant_group === '') {
            $sourceProduct->variant_group = $this->generateUuid();
            $sourceProduct->save();
        }

        $this->validate([
            'title' => 'required|string|max:255',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
        ]);

        // Create new product as a copy with modifications
        $newProduct = new Product();
        $newProduct->title = $this->title !== '' ? $this->title : $sourceProduct->title . ' (Variant)';
        $newProduct->description = $this->description ?? $sourceProduct->description;
        $newProduct->price = $this->price > 0 ? $this->price : $sourceProduct->price;
        $newProduct->stock = $this->stock >= 0 ? $this->stock : $sourceProduct->stock;
        $newProduct->views = 0;
        $newProduct->variant_group = $sourceProduct->variant_group;
        $newProduct->save();

        return JsonResponse::created([
            'product' => [
                'id' => $newProduct->id,
                'title' => $newProduct->title,
                'description' => $newProduct->description,
                'price' => $newProduct->price,
                'stock' => $newProduct->stock,
                'views' => $newProduct->views,
                'variant_group' => $newProduct->variant_group,
                'images' => [],
                'attributes' => [],
                'created_at' => $newProduct->created_at,
                'updated_at' => $newProduct->updated_at,
            ],
        ]);
    }

    /**
     * Remove a product from its variant group
     */
    #[ResponseType(['message' => 'string'])]
    public function delete(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        $product->variant_group = null;
        $product->save();

        return JsonResponse::ok([
            'message' => 'Product removed from variant group',
        ]);
    }

    /**
     * Generate a UUID v4
     */
    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

