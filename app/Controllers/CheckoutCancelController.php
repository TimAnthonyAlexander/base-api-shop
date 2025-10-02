<?php

namespace App\Controllers;

use App\Models\Basket;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * CheckoutCancelController
 * 
 * Handles cancelled Stripe checkout callbacks.
 */
class CheckoutCancelController extends Controller
{
    public string $basket_id;

    public function get(): JsonResponse
    {
        $this->validate([
            'basket_id' => 'required|string',
        ]);

        // Find the basket to verify it exists
        $basket = Basket::find($this->basket_id);

        if (!$basket instanceof Basket) {
            return JsonResponse::notFound('Basket not found');
        }

        return JsonResponse::ok([
            'message' => 'Checkout cancelled',
            'basket_id' => $this->basket_id,
        ]);
    }
}

