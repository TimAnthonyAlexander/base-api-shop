<?php

namespace App\Controllers;

use App\Models\ProductImage;
use App\Models\Basket;
use App\Models\BasketItem;
use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * BasketController
 * 
 * Add your controller description here.
 */
class BasketController extends Controller
{
    public string $product_id;

    public string $action = 'add';

    public function get(): JsonResponse
    {
        /** @var Basket|null $basket */
        $basket = Basket::where('user_id', '=', $this->request->user['id'])->first();

        if (!$basket instanceof Basket) {
            $basket = new Basket();
            $basket->user_id = $this->request->user['id'];
            $basket->save();
        }

        $basketItems = BasketItem::where('basket_id', '=', $basket->id)->get();

        // Enrich basket items with product details
        $enrichedItems = [];
        foreach ($basketItems as $basketItem) {
            $product = Product::find($basketItem->product_id);
            $productData = null;
            if ($product instanceof Product) {
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
                    'images' => $imageUrls,
                ];
            }

            $itemData = [
                'id' => $basketItem->id,
                'basket_id' => $basketItem->basket_id,
                'product_id' => $basketItem->product_id,
                'quantity' => $basketItem->quantity,
                'created_at' => $basketItem->created_at,
                'updated_at' => $basketItem->updated_at,
                'product' => $productData,
            ];
            $enrichedItems[] = $itemData;
        }

        if ($enrichedItems !== [] && ($basket->stripe_checkout === null || $basket->stripe_checkout === '')) {
            $basket->stripe_checkout = $basket->createStripeCheckout();
            $basket->save();
        }

        return JsonResponse::ok([
            'basket' => $basket,
            'items' => $enrichedItems,
        ]);
    }

    public function post(): JsonResponse
    {
        $this->validate([
            'product_id' => 'required|string|max:255',
        ]);

        /** @var Basket|null $basket */
        $basket = Basket::where('user_id', '=', $this->request->user['id'])->first();

        if (!$basket instanceof Basket) {
            $basket = new Basket();
            $basket->user_id = $this->request->user['id'];
            $basket->save();
        }

        if ($basket->user_id !== $this->request->user['id']) {
            return JsonResponse::forbidden('You do not own this basket');
        }

        $product = Product::cached()->find($this->product_id);

        if (!$product instanceof Product) {
            return JsonResponse::notFound('Product not found');
        }

        $basketItem = BasketItem::whereConditions([
            [
                'column' => 'basket_id',
                'operator' => '=',
                'value' => $basket->id,
            ],
            [
                'column' => 'product_id',
                'operator' => '=',
                'value' => $product->id,
            ],
        ])->first();

        if ($this->action === 'remove') {
            if (!$basketItem instanceof BasketItem) {
                return JsonResponse::notFound('Product not in basket');
            }

            $basket->stripe_checkout = '';
            $basket->save();

            $basketItem->quantity -= 1;

            if ($basketItem->quantity <= 0) {
                $basketItem->delete();
            } else {
                $basketItem->save();
            }
        } else {
            $basket->stripe_checkout = '';
            $basket->save();

            if ($basketItem instanceof BasketItem) {
                if ($product->stock <= $basketItem->quantity) {
                    return JsonResponse::badRequest('Not enough stock for this product');
                }

                $basketItem->quantity += 1;
                $basketItem->save();
            } else {
                $basketItem = new BasketItem();
                $basketItem->basket_id = $basket->id;
                $basketItem->product_id = $product->id;
                $basketItem->quantity = 1;
                $basketItem->save();
            }
        }

        // Return the full basket data like GET does
        $basketItems = BasketItem::where('basket_id', '=', $basket->id)->get();

        $enrichedItems = [];
        foreach ($basketItems as $basketItem) {
            $product = Product::cached()->find($basketItem->product_id);
            $productData = null;
            if ($product instanceof Product) {
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
                    'images' => $imageUrls,
                ];
            }

            $itemData = [
                'id' => $basketItem->id,
                'basket_id' => $basketItem->basket_id,
                'product_id' => $basketItem->product_id,
                'quantity' => $basketItem->quantity,
                'created_at' => $basketItem->created_at,
                'updated_at' => $basketItem->updated_at,
                'product' => $productData,
            ];
            $enrichedItems[] = $itemData;
        }

        if ($enrichedItems !== []) {
            $basket->stripe_checkout = $basket->createStripeCheckout();
            $basket->save();
        }

        return JsonResponse::ok([
            'basket' => $basket,
            'items' => $enrichedItems,
        ]);
    }
}
