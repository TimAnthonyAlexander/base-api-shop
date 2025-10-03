<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\ProductAttribute;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminProductAttributeController extends Controller
{
    public ?string $id = null;

    public ?string $attribute_id = null;

    public string $attribute = '';

    public string $value = '';

    /**
     * Add product attribute
     */
    #[ResponseType(['attribute' => 'array'])]
    public function post(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Product ID is required');
        }

        $product = Product::find($this->id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        $this->validate([
            'attribute' => 'required|string|max:255',
            'value' => 'required|string',
        ]);

        $productAttribute = new ProductAttribute();
        $productAttribute->product_id = $product->id;
        $productAttribute->attribute = $this->attribute;
        $productAttribute->value = $this->value;
        $productAttribute->save();

        return JsonResponse::created([
            'attribute' => [
                'id' => $productAttribute->id,
                'attribute' => $productAttribute->attribute,
                'value' => $productAttribute->value,
                'created_at' => $productAttribute->created_at,
            ],
        ]);
    }

    /**
     * Update product attribute
     */
    #[ResponseType(['attribute' => 'array'])]
    public function put(): JsonResponse
    {
        if ($this->attribute_id === null) {
            return JsonResponse::badRequest('Attribute ID is required');
        }

        $productAttribute = ProductAttribute::find($this->attribute_id);

        if (!$productAttribute instanceof ProductAttribute) {
            return JsonResponse::notFound('Attribute not found');
        }

        $this->validate([
            'attribute' => 'string|max:255',
            'value' => 'string',
        ]);

        if ($this->attribute !== '') {
            $productAttribute->attribute = $this->attribute;
        }

        if ($this->value !== '') {
            $productAttribute->value = $this->value;
        }

        $productAttribute->save();

        return JsonResponse::ok([
            'attribute' => [
                'id' => $productAttribute->id,
                'attribute' => $productAttribute->attribute,
                'value' => $productAttribute->value,
                'updated_at' => $productAttribute->updated_at,
            ],
        ]);
    }

    /**
     * Delete product attribute
     */
    #[ResponseType(['message' => 'string'])]
    public function delete(): JsonResponse
    {
        if ($this->attribute_id === null) {
            return JsonResponse::badRequest('Attribute ID is required');
        }

        $productAttribute = ProductAttribute::find($this->attribute_id);

        if (!$productAttribute instanceof ProductAttribute) {
            return JsonResponse::notFound('Attribute not found');
        }

        $productAttribute->delete();

        return JsonResponse::ok([
            'message' => 'Attribute deleted successfully',
        ]);
    }
}

