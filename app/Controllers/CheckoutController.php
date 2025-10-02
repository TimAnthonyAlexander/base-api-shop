<?php

namespace App\Controllers;

use Exception;
use App\Models\Basket;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * CheckoutController
 * 
 * Handles Stripe checkout flow
 */
class CheckoutController extends Controller
{
    /**
     * Create a Stripe checkout session for the user's basket
     */
    public function post(): JsonResponse
    {
        $basket = Basket::where('user_id', '=', $this->request->user['id'])->first();

        if (!$basket instanceof Basket) {
            return JsonResponse::badRequest('No basket found for user');
        }

        // Check if basket has items
        $items = $basket->items()->get();
        if ($items === []) {
            return JsonResponse::badRequest('Basket is empty');
        }

        try {
            $checkoutUrl = $basket->createStripeCheckout();

            return JsonResponse::ok([
                'checkout_url' => $checkoutUrl,
                'message' => 'Checkout session created successfully',
            ]);
        } catch (Exception $exception) {
            return JsonResponse::error('Failed to create checkout session: ' . $exception->getMessage());
        }
    }

    /**
     * Handle successful checkout (redirect from Stripe)
     */
    public function get(): JsonResponse
    {
        $sessionId = $this->request->query['session_id'] ?? null;
        $basketId = $this->request->query['basket_id'] ?? null;

        if (!$sessionId || !$basketId) {
            return JsonResponse::badRequest('Missing session_id or basket_id');
        }

        // Here you would typically:
        // 1. Verify the Stripe session
        // 2. Create an order from the basket
        // 3. Clear the basket
        // 4. Send confirmation email

        return JsonResponse::ok([
            'message' => 'Checkout successful',
            'session_id' => $sessionId,
            'basket_id' => $basketId,
        ]);
    }
}

