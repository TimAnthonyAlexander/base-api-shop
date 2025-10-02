<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;
use Stripe\Checkout\Session;
use Stripe\StripeClient;
use App\Models\Basket;
use App\Models\BasketItem;
use App\Models\Product;

/**
 * Simple Stripe integration service.
 * Handles checkout session creation and product management.
 */
class StripeService
{
    private readonly StripeClient $stripeClient;

    public function __construct()
    {
        $apiKey = $_ENV['STRIPE_SECRET_KEY'] ?? '';
        
        if ($apiKey === '') {
            throw new RuntimeException('STRIPE_SECRET_KEY not configured in environment');
        }

        $this->stripeClient = new StripeClient($apiKey);
    }

    /**
     * Create a Stripe checkout session from a basket.
     * 
     * @param Basket $basket The basket to create checkout for
     * @param string|null $customerEmail Optional customer email
     * @return Session The created checkout session
     */
    public function createCheckoutSession(Basket $basket, ?string $customerEmail = null): Session
    {
        $lineItems = $this->buildLineItemsFromBasket($basket);

        $sessionData = [
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => $this->getSuccessUrl($basket->id),
            'cancel_url' => $this->getCancelUrl($basket->id),
            'metadata' => [
                'basket_id' => $basket->id,
                'user_id' => $basket->user_id,
            ],
        ];

        // Add customer email if provided
        if ($customerEmail !== null && $customerEmail !== '') {
            $sessionData['customer_email'] = $customerEmail;
        }

        // Add shipping if configured
        $shippingEnabled = $_ENV['STRIPE_SHIPPING_ENABLED'] ?? 'false';
        if ($shippingEnabled === 'true') {
            $sessionData['shipping_address_collection'] = [
                'allowed_countries' => explode(',', $_ENV['STRIPE_SHIPPING_COUNTRIES'] ?? 'DE,AT,CH'),
            ];
        }

        return $this->stripeClient->checkout->sessions->create($sessionData);
    }

    /**
     * Build Stripe line items from basket items.
     *
     * @return array<int, array<string, mixed>>
     */
    private function buildLineItemsFromBasket(Basket $basket): array
    {
        $items = BasketItem::where('basket_id', '=', $basket->id)->get();
        $lineItems = [];

        foreach ($items as $item) {
            assert($item instanceof BasketItem);
            
            $product = Product::find($item->product_id);
            
            if (!$product instanceof Product) {
                continue;
            }

            $productData = [
                'name' => $product->title,
            ];
            
            // Only add description if it's not empty (Stripe doesn't accept empty strings)
            if ($product->description !== null && $product->description !== '') {
                $productData['description'] = $product->description;
            }
            
            $lineItems[] = [
                'price_data' => [
                    'currency' => $_ENV['STRIPE_CURRENCY'] ?? 'eur',
                    'product_data' => $productData,
                    'unit_amount' => (int) ($product->price * 100), // Convert to cents
                ],
                'quantity' => $item->quantity,
            ];
        }

        return $lineItems;
    }

    /**
     * Get success redirect URL.
     */
    private function getSuccessUrl(string $basketId): string
    {
        $baseUrl = $_ENV['APP_URL'] ?? 'http://127.0.0.1:7879';
        return $baseUrl . '/checkout/success?session_id={CHECKOUT_SESSION_ID}&basket_id=' . $basketId;
    }

    /**
     * Get cancel redirect URL.
     */
    private function getCancelUrl(string $basketId): string
    {
        $baseUrl = $_ENV['APP_URL'] ?? 'http://127.0.0.1:7879';
        return $baseUrl . '/checkout/cancel?basket_id=' . $basketId;
    }

    /**
     * Retrieve a checkout session by ID.
     */
    public function getSession(string $sessionId): Session
    {
        return $this->stripeClient->checkout->sessions->retrieve($sessionId);
    }

    /**
     * Create a Stripe product.
     */
    public function createProduct(string $name, string $description, float $price): \Stripe\Product
    {
        $productData = [
            'name' => $name,
            'default_price_data' => [
                'currency' => $_ENV['STRIPE_CURRENCY'] ?? 'eur',
                'unit_amount' => (int) ($price * 100),
            ],
        ];
        
        // Only add description if it's not empty (Stripe doesn't accept empty strings)
        if ($description !== '') {
            $productData['description'] = $description;
        }

        return $this->stripeClient->products->create($productData);
    }

    /**
     * Delete a Stripe product.
     */
    public function deleteProduct(string $productId): void
    {
        $this->stripeClient->products->delete($productId);
    }
}

