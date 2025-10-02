<?php

namespace App\Controllers;

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

        if ($basket->stripe_checkout === '') {
            $basket->stripe_checkout = $basket->createStripeCheckout();
            $basket->save();
        }

        $basketItems = BasketItem::where('basket_id', '=', $basket->id)->get();

        return JsonResponse::ok([
            'basket' => $basket,
            'items' => $basketItems,
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

        $product = Product::find($this->product_id);

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

            $basketItem->quantity -= 1;

            if ($basketItem->quantity <= 0) {
                $basketItem->delete();

                return JsonResponse::ok([
                    'basket_item' => null,
                    'message' => 'Product removed from basket',
                ]);
            }

            $basketItem->save();

            return JsonResponse::ok([
                'basket_item' => $basketItem,
                'message' => 'Product quantity updated in basket',
            ]);
        }

        if ($basketItem instanceof BasketItem) {
            $basketItem->quantity += 1;
            $basketItem->save();

            return JsonResponse::ok([
                'basket_item' => $basketItem,
                'message' => 'Product quantity updated in basket',
            ]);
        }

        $basketItem = new BasketItem();
        $basketItem->basket_id = $basket->id;
        $basketItem->product_id = $product->id;
        $basketItem->quantity = 1;
        $basketItem->save();

        return JsonResponse::created([
            'basket_item' => $basketItem,
        ]);
    }
}
