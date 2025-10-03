<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\UploadedFile;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminProductController extends Controller
{
    public ?string $id = null;

    public string $title = '';

    public ?string $description = null;

    public float $price = 0.0;

    public int $stock = 0;

    public ?string $status = null;

    public int $page = 1;

    public int $per_page = 20;

    public ?UploadedFile $image = null;

    public ?string $image_id = null;

    /**
     * List all products with pagination
     */
    #[ResponseType(['products' => 'array', 'total' => 'int', 'page' => 'int', 'per_page' => 'int'])]
    public function get(): JsonResponse
    {
        // Get single product
        if ($this->id !== null) {
            $product = Product::find($this->id);

            if (!$product instanceof Product) {
                return JsonResponse::notFound('Product not found');
            }

            // Get product images
            $images = $product->images()->get();
            $imageData = [];
            foreach ($images as $image) {
                if ($image instanceof ProductImage) {
                    $imageData[] = [
                        'id' => $image->id,
                        'path' => $image->image_path,
                    ];
                }
            }

            // Get product attributes
            $attributes = $product->attributes()->get();
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

            $productData = [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'views' => $product->views,
                'images' => $imageData,
                'attributes' => $attributesData,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];

            return JsonResponse::ok([
                'product' => $productData,
            ]);
        }

        // List all products
        $allProducts = Product::all();
        $total = count($allProducts);

        // Simple pagination
        $offset = ($this->page - 1) * $this->per_page;
        $paginatedProducts = array_slice($allProducts, $offset, $this->per_page);

        $productsWithImages = [];
        foreach ($paginatedProducts as $paginatedProduct) {
            if ($paginatedProduct instanceof Product) {
                $images = $paginatedProduct->images()->get();
                $imageData = [];
                foreach ($images as $image) {
                    if ($image instanceof ProductImage) {
                        $imageData[] = [
                            'id' => $image->id,
                            'path' => $image->image_path,
                        ];
                    }
                }

                // Get product attributes
                $attributes = $paginatedProduct->attributes()->get();
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

                $productsWithImages[] = [
                    'id' => $paginatedProduct->id,
                    'title' => $paginatedProduct->title,
                    'description' => $paginatedProduct->description,
                    'price' => $paginatedProduct->price,
                    'stock' => $paginatedProduct->stock,
                    'views' => $paginatedProduct->views,
                    'images' => $imageData,
                    'attributes' => $attributesData,
                    'created_at' => $paginatedProduct->created_at,
                    'updated_at' => $paginatedProduct->updated_at,
                ];
            }
        }

        return JsonResponse::ok([
            'products' => $productsWithImages,
            'total' => $total,
            'page' => $this->page,
            'per_page' => $this->per_page,
        ]);
    }

    /**
     * Create a new product or upload image
     */
    #[ResponseType(['product' => 'array'])]
    public function post(): JsonResponse
    {
        // Check if this is an image upload request
        if (str_contains($this->request->path, '/image')) {
            return $this->uploadImage();
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
        $product->views = 0;
        $product->save();

        return JsonResponse::created([
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'views' => $product->views,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ],
        ]);
    }

    /**
     * Update an existing product
     */
    #[ResponseType(['product' => 'array'])]
    public function put(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        $this->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
        ]);

        if ($this->title !== '') {
            $product->title = $this->title;
        }

        if ($this->description !== null) {
            $product->description = $this->description;
        }

        if ($this->price > 0) {
            $product->price = $this->price;
        }

        if ($this->stock >= 0) {
            $product->stock = $this->stock;
        }

        $product->save();

        // Get product images
        $images = $product->images()->get();
        $imageData = [];
        foreach ($images as $image) {
            if ($image instanceof ProductImage) {
                $imageData[] = [
                    'id' => $image->id,
                    'path' => $image->image_path,
                ];
            }
        }

        // Get product attributes
        $attributes = $product->attributes()->get();
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

        return JsonResponse::ok([
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'views' => $product->views,
                'images' => $imageData,
                'attributes' => $attributesData,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ],
        ]);
    }

    /**
     * Delete a product
     */
    #[ResponseType(['message' => 'string'])]
    public function delete(): JsonResponse
    {
        // Handle image deletion specifically
        if ($this->image_id !== null) {
            return $this->deleteImage();
        }

        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        // Delete associated images
        $images = $product->images()->get();
        foreach ($images as $image) {
            if ($image instanceof ProductImage) {
                // Delete physical file
                $imagePath = __DIR__ . '/../../storage/public/products/' . basename($image->image_path);
                if (file_exists($imagePath)) {
                    @unlink($imagePath);
                }

                $image->delete();
            }
        }

        $product->delete();

        return JsonResponse::ok([
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Upload product image
     */
    #[ResponseType(['image' => 'array'])]
    public function uploadImage(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        if (!$this->image instanceof UploadedFile) {
            return JsonResponse::badRequest('Image file is required');
        }

        // Validate image
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($this->image->getMimeType(), $allowedTypes, true)) {
            return JsonResponse::badRequest('Invalid image type. Allowed: jpeg, png, gif, webp');
        }

        if ($this->image->getSize() > 5 * 1024 * 1024) {
            return JsonResponse::badRequest('Image size must be less than 5MB');
        }

        // Ensure directory exists
        $storageDir = __DIR__ . '/../../storage/public/products';
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        // Generate unique filename
        $extension = pathinfo($this->image->name, PATHINFO_EXTENSION);
        $filename = 'product_' . $product->id . '_' . uniqid() . '.' . $extension;
        $filePath = $storageDir . '/' . $filename;

        // Move uploaded file
        if ($this->image->storePublicly($filePath) === '') {
            return JsonResponse::error('Failed to save image', 500);
        }

        // Create ProductImage record
        $productImage = new ProductImage();
        $productImage->product_id = $product->id;
        $productImage->image_path = 'storage/products/' . $filename;
        $productImage->save();

        return JsonResponse::created([
            'image' => [
                'id' => $productImage->id,
                'image_path' => $productImage->image_path,
                'created_at' => $productImage->created_at,
            ],
        ]);
    }

    /**
     * Delete a product image
     */
    private function deleteImage(): JsonResponse
    {
        $productImage = ProductImage::find($this->image_id);

        if (!$productImage instanceof ProductImage) {
            return JsonResponse::notFound('Image not found');
        }

        // Delete physical file
        $imagePath = __DIR__ . '/../../storage/public/products/' . basename($productImage->image_path);
        if (file_exists($imagePath)) {
            @unlink($imagePath);
        }

        $productImage->delete();

        return JsonResponse::ok([
            'message' => 'Image deleted successfully',
        ]);
    }

    /**
     * Get all products in the same variant group as this product
     */
    #[ResponseType(['variants' => 'array'])]
    public function getVariants(): JsonResponse
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
    public function createVariant(): JsonResponse
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
     * Group products together as variants
     */
    #[ResponseType(['message' => 'string', 'variant_group' => 'string'])]
    public function groupProducts(): JsonResponse
    {
        // Expecting 'product_ids' in request body
        $body = $this->request->body;
        
        if (!isset($body['product_ids']) || !is_array($body['product_ids']) || count($body['product_ids']) < 2) {
            return JsonResponse::badRequest('At least 2 product IDs are required');
        }

        $productIds = $body['product_ids'];
        
        // Find all products
        $products = [];
        foreach ($productIds as $productId) {
            $product = Product::find($productId);
            if ($product instanceof Product) {
                $products[] = $product;
            }
        }

        if (count($products) < 2) {
            return JsonResponse::badRequest('At least 2 valid products are required');
        }

        // Check if any product already has a variant group
        $existingGroup = null;
        foreach ($products as $product) {
            if ($product->variant_group !== null && $product->variant_group !== '') {
                $existingGroup = $product->variant_group;
                break;
            }
        }

        // Use existing group or create new one
        $variantGroup = $existingGroup ?? $this->generateUuid();

        // Assign variant group to all products
        foreach ($products as $product) {
            $product->variant_group = $variantGroup;
            $product->save();
        }

        return JsonResponse::ok([
            'message' => 'Products grouped successfully',
            'variant_group' => $variantGroup,
        ]);
    }

    /**
     * Remove a product from its variant group
     */
    #[ResponseType(['message' => 'string'])]
    public function ungroupProduct(): JsonResponse
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
