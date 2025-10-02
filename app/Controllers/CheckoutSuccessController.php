<?php

namespace App\Controllers;

use Exception;
use App\Models\Basket;
use App\Models\Order;
use App\Services\StripeService;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use Stripe\StripeObject;

/**
 * CheckoutSuccessController
 * 
 * Handles successful Stripe checkout callbacks.
 * Verifies payment status and converts basket to order.
 */
class CheckoutSuccessController extends Controller
{
    public string $session_id;

    public string $basket_id;

    public function get(): JsonResponse
    {
        $this->validate([
            'session_id' => 'required|string',
            'basket_id' => 'required|string',
        ]);

        // Find the basket
        $basket = Basket::find($this->basket_id);

        if (!$basket instanceof Basket) {
            return JsonResponse::notFound('Basket not found');
        }

        // Verify with Stripe that the checkout session was successful
        try {
            $stripeService = new StripeService();
            $session = $stripeService->getSession($this->session_id);

            // Check if payment was successful
            if ($session->payment_status !== 'paid') {
                return JsonResponse::badRequest('Payment not completed');
            }

            /** @var array{basket_id?: string} $metadata */
            $metadata = $session->metadata instanceof StripeObject ? $session->metadata->toArray() : [];

            if (($metadata['basket_id'] ?? null) !== $this->basket_id) {
                return JsonResponse::forbidden('Session does not match basket');
            }
        } catch (Exception $exception) {
            return JsonResponse::error('Failed to verify payment: ' . $exception->getMessage());
        }

        // Convert basket to order and reduce stock
        $order = Order::createFromBasket($basket)
            ->deleteBasket($basket);

        return JsonResponse::ok([
            'order' => $order,
            'message' => 'Order created successfully',
        ]);
    }
}
