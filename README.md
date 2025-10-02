# Stripe Integration

This shop project includes a simple Stripe payment integration using the official Stripe PHP SDK.

## Setup

### 1. Install Dependencies

The Stripe SDK is already installed via Composer:

```bash
composer require stripe/stripe-php
```

### 2. Configure Environment Variables

Add your Stripe API keys to your `.env` file:

```bash
# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_CURRENCY=eur

# Optional: Enable shipping address collection
STRIPE_SHIPPING_ENABLED=false
STRIPE_SHIPPING_COUNTRIES=DE,AT,CH
```

**Get your API keys from:** https://dashboard.stripe.com/apikeys

⚠️ **Important:** Never commit your `.env` file to version control!

## Usage

### Creating a Checkout Session

The `Basket` model has a convenient method to create a Stripe checkout session:

```php
$basket = Basket::find($basketId);
$checkoutUrl = $basket->createStripeCheckout();

// Redirect user to $checkoutUrl
```

### Using the CheckoutController

A `CheckoutController` is provided to handle the checkout flow:

```php
POST /checkout
```

This endpoint:
1. Gets the authenticated user's basket
2. Creates a Stripe checkout session
3. Returns the checkout URL

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/...",
  "message": "Checkout session created successfully"
}
```

### Handling Success/Cancel Redirects

After payment, Stripe redirects to:
- **Success:** `{APP_URL}/checkout/success?session_id={SESSION_ID}&basket_id={BASKET_ID}`
- **Cancel:** `{APP_URL}/checkout/cancel?basket_id={BASKET_ID}`

Implement these routes to handle post-payment logic (create orders, clear baskets, etc.).

## Architecture

### StripeService (`app/Services/StripeService.php`)

A simple service class that wraps the Stripe SDK:

- `createCheckoutSession(Basket $basket, ?string $customerEmail = null): Session`
- `getSession(string $sessionId): Session`
- `createProduct(string $name, string $description, float $price): Product`
- `deleteProduct(string $productId): void`

**Features:**
- Reads configuration from environment variables (KISS principle)
- Automatically builds line items from basket
- Includes metadata (basket_id, user_id) for webhook processing
- Optional shipping address collection

### Basket Model Integration

The `Basket` model includes a convenient method:

```php
public function createStripeCheckout(): string
```

This method:
1. Gets the user's email
2. Creates a Stripe checkout session with basket items
3. Returns the checkout URL

### Example Route Configuration

Add to `routes/api.php`:

```php
use App\Controllers\CheckoutController;
use App\Middleware\CombinedAuthMiddleware;

$router->post('/checkout', CheckoutController::class, [CombinedAuthMiddleware::class]);
$router->get('/checkout/success', CheckoutController::class);
$router->get('/checkout/cancel', CheckoutController::class);
```

## Webhooks (Optional)

To handle Stripe webhooks for payment confirmation, you can create a webhook endpoint:

```php
class StripeWebhookController extends Controller
{
    public function post(): JsonResponse
    {
        $payload = $this->request->body;
        $signature = $this->request->headers['Stripe-Signature'] ?? '';
        
        // Verify webhook signature
        // Process events (checkout.session.completed, etc.)
        
        return JsonResponse::ok(['received' => true]);
    }
}
```

## Currency Configuration

The default currency is EUR. To change it, update `STRIPE_CURRENCY` in your `.env`:

```bash
STRIPE_CURRENCY=usd  # or eur, gbp, chf, etc.
```

## Testing

Use Stripe's test mode API keys (starting with `sk_test_`) for development. Test card numbers:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0027 6000 3184`

More test cards: https://stripe.com/docs/testing

## Production Checklist

- [ ] Replace test API keys with live keys (`sk_live_...`)
- [ ] Set `APP_ENV=production`
- [ ] Enable HTTPS for your domain
- [ ] Set up Stripe webhooks for payment confirmation
- [ ] Implement proper error handling and logging
- [ ] Test the complete checkout flow

## Additional Resources

- [Stripe PHP SDK Documentation](https://stripe.com/docs/api/php)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Dashboard](https://dashboard.stripe.com/)

