<?php

namespace App\Models;

use App\Services\StripeService;
use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Database\Relations\HasMany;
use BaseApi\Models\BaseModel;

/**
 * Basket Model
 */
class Basket extends BaseModel
{
    public string $user_id;

    public ?string $stripe_checkout = null;

    /**
     * Define custom columns for this model
     * @var array<string, array<string, mixed>>
     */
    public static array $columns = [
        'stripe_checkout' => ['type' => 'TEXT', 'nullable' => true],
    ];

    /**
     * Create a Stripe checkout session for this basket.
     * 
     * @return string The Stripe checkout session URL
     */
    public function createStripeCheckout(): string
    {
        // Get user for email
        $user = $this->user()->get();
        $customerEmail = $user instanceof User ? $user->email : null;

        // Create checkout session
        $stripeService = new StripeService();
        $session = $stripeService->createCheckoutSession($this, $customerEmail);

        return $session->url ?? '';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BasketItem::class);
    }
}
