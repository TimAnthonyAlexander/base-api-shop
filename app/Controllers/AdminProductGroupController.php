<?php

namespace App\Controllers;

use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminProductGroupController extends Controller
{
    /**
     * Group products together as variants
     */
    #[ResponseType(['message' => 'string', 'variant_group' => 'string'])]
    public function post(): JsonResponse
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
            'product_count' => count($products),
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

