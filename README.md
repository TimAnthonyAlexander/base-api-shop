# Shop API

A modern e-commerce REST API built with [BaseAPI](https://github.com/TimAnthonyAlexander/base-api) - a lightweight PHP 8.4+ framework designed for building high-performance JSON APIs.

## Features

### 🛍️ E-Commerce Core
- **Product Management** - Create, read, and manage product catalog with stock tracking
- **Shopping Basket** - Session-based shopping cart with real-time updates
- **Order Processing** - Convert baskets to orders with full order history
- **Stripe Integration** - Secure payment processing with Stripe Checkout

### 🔐 Authentication & Authorization
- **Dual Authentication** - Session-based and API token authentication
- **User Management** - Registration, login, and profile management
- **API Tokens** - Generate and manage long-lived API tokens for integrations
- **Role-Based Access** - Admin and user roles with permission checks

### 📁 File Management
- **File Uploads** - Support for images, documents, and other file types
- **Multiple Storage** - Local and public storage with configurable paths
- **Validation** - Size limits, MIME type validation, and secure storage

### ⚡ Background Jobs
- **Database Backups** - Automated backup jobs with compression and retention
- **Email Sending** - Asynchronous email delivery via queue
- **Image Processing** - Resize, crop, and thumbnail generation
- **External API Calls** - HTTP client with retry logic and error handling

### 🛠️ Developer Tools
- **OpenAPI Documentation** - Auto-generated API spec at `/openapi`
- **Health Checks** - Database and cache health monitoring
- **Pre-commit Hooks** - PHPStan, PHPUnit, and Rector validation
- **CI/CD Ready** - GitHub Actions workflow included

## Requirements

- **PHP 8.4+** with extensions: curl, json, mbstring, pdo
- **Composer** for dependency management
- **MySQL 8.0+** or **PostgreSQL 14+** (SQLite for development)
- **Redis** (optional, for caching and queues)
- **Stripe Account** (for payment processing)

## Installation

### 1. Clone or Copy the Project

```bash
cd /path/to/baseapi-workspace
# The shop/ directory is already set up
cd shop
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Configure Environment

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:7879

# Database
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=shop
DB_USER=root
DB_PASSWORD=

# Stripe (Required for checkout)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CURRENCY=eur
STRIPE_SHIPPING_ENABLED=true
STRIPE_SHIPPING_COUNTRIES=DE,AT,CH

# Cache (Optional)
CACHE_DRIVER=file
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Queue (Optional)
QUEUE_DRIVER=sync
```

### 4. Set Up Database

Generate and apply migrations:

```bash
php mason migrate:generate
php mason migrate:apply
```

### 5. Set Up Git Hooks (Optional)

```bash
composer setup-hooks
```

### 6. Start the Server

```bash
php mason serve
# or
composer serve-api
```

The API will be available at `http://127.0.0.1:7879`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure-password"
}
```

#### Get Current User
```http
GET /me
Cookie: PHPSESSID=...
```

#### Logout
```http
POST /logout
Cookie: PHPSESSID=...
```

#### Create API Token
```http
POST /api-tokens
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "name": "My Integration Token",
  "expires_at": "2025-12-31 23:59:59"
}
```

#### List API Tokens
```http
GET /api-tokens
Cookie: PHPSESSID=...
```

#### Delete API Token
```http
DELETE /api-tokens/{id}
Cookie: PHPSESSID=...
```

### Product Endpoints

#### Get Product
```http
GET /products/{id}
```

#### Create Product (Admin only)
```http
POST /products
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "title": "Amazing Product",
  "description": "Product description",
  "price": 29.99,
  "stock": 100
}
```

### Basket Endpoints

#### Get Basket
```http
GET /basket
Cookie: PHPSESSID=...
```

#### Add to Basket
```http
POST /basket
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "product_id": "product-uuid",
  "action": "add"
}
```

#### Remove from Basket
```http
POST /basket
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "product_id": "product-uuid",
  "action": "remove"
}
```

### Checkout Endpoints

#### Create Checkout Session
```http
POST /checkout
Cookie: PHPSESSID=...
```

Returns:
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "message": "Checkout session created successfully"
}
```

#### Checkout Success Callback
```http
GET /checkout/success?session_id={CHECKOUT_SESSION_ID}&basket_id={BASKET_ID}
```

### Order Endpoints

#### Get Order
```http
GET /orders/{id}
Cookie: PHPSESSID=...
```

#### Create Order from Basket
```http
POST /orders
Cookie: PHPSESSID=...
```

### File Upload Endpoints

#### Upload File
```http
POST /files/upload
Cookie: PHPSESSID=...
Content-Type: multipart/form-data

file: (binary)
```

Supported formats: `jpg`, `jpeg`, `png`, `gif`, `pdf`, `doc`, `docx`  
Max size: 5MB

#### Upload Public File
```http
POST /files/upload-public
Cookie: PHPSESSID=...
Content-Type: multipart/form-data

file: (binary)
```

#### Get File Info
```http
GET /files/info?path=uploads/filename.jpg
Cookie: PHPSESSID=...
```

#### Delete File
```http
DELETE /files
Cookie: PHPSESSID=...
Content-Type: application/json

{
  "path": "uploads/filename.jpg"
}
```

### System Endpoints

#### Health Check
```http
GET /health?db=1&cache=1
```

#### OpenAPI Specification
```http
GET /openapi
```

Returns the full OpenAPI 3.1.0 specification for the API.

## Authentication

The API supports two authentication methods:

### 1. Session-Based Authentication
Use the session cookie returned from `/login`:
```http
Cookie: PHPSESSID=abc123...
```

### 2. API Token Authentication
Use a Bearer token in the Authorization header:
```http
Authorization: Bearer your-api-token-here
```

### Combined Authentication
Most endpoints support both methods via `CombinedAuthMiddleware`.

## Background Jobs

### Running the Queue Worker

For production, run jobs asynchronously:

```bash
# Set queue driver to database
QUEUE_DRIVER=database

# Start the worker
php mason queue:work
```

### Available Jobs

- **SendEmailJob** - Sends emails asynchronously
- **BackupDatabaseJob** - Creates compressed database backups
- **ProcessImageJob** - Resizes, crops, and generates thumbnails
- **CallExternalApiJob** - Makes HTTP requests with retry logic

### Dispatching Jobs

```php
use App\Jobs\SendEmailJob;
use function BaseApi\dispatch;

dispatch(new SendEmailJob(
    to: 'user@example.com',
    subject: 'Welcome!',
    body: 'Welcome to our shop!'
));
```

## Development

### Running Tests

```bash
composer phpunit
```

### Static Analysis

```bash
composer phpstan
```

### Code Modernization

```bash
# Check for outdated patterns
composer rector

# Auto-fix issues
composer rector:fix
```

### Pre-commit Hooks

The project includes pre-commit hooks that run:
- PHP syntax checking
- PHPStan static analysis
- Rector modernization checks
- PHPUnit tests
- Security checks (eval detection)
- Code quality checks

Install them with:
```bash
composer setup-hooks
```

## Project Structure

```
shop/
├── app/
│   ├── Auth/
│   │   └── SimpleUserProvider.php    # User authentication provider
│   ├── Controllers/
│   │   ├── ApiTokenController.php    # API token management
│   │   ├── BasketController.php      # Shopping basket operations
│   │   ├── CheckoutController.php    # Stripe checkout flow
│   │   ├── FileUploadController.php  # File upload handling
│   │   ├── LoginController.php       # User login
│   │   ├── LogoutController.php      # User logout
│   │   ├── MeController.php          # Current user info
│   │   ├── OrderController.php       # Order management
│   │   ├── ProductController.php     # Product CRUD
│   │   ├── SignupController.php      # User registration
│   │   ├── HealthController.php      # Health checks
│   │   └── OpenApiController.php     # API documentation
│   ├── Jobs/
│   │   ├── BackupDatabaseJob.php     # Database backup automation
│   │   ├── CallExternalApiJob.php    # External API integration
│   │   ├── ProcessImageJob.php       # Image processing
│   │   └── SendEmailJob.php          # Email delivery
│   ├── Middleware/
│   │   ├── ApiTokenAuthMiddleware.php      # Token authentication
│   │   └── CombinedAuthMiddleware.php      # Session + token auth
│   ├── Models/
│   │   ├── ApiToken.php              # API token model
│   │   ├── Basket.php                # Shopping basket
│   │   ├── BasketItem.php            # Basket line items
│   │   ├── Order.php                 # Customer orders
│   │   ├── OrderItem.php             # Order line items
│   │   ├── Product.php               # Product catalog
│   │   ├── ProductImage.php          # Product images
│   │   └── User.php                  # User accounts
│   ├── Providers/
│   │   └── AppServiceProvider.php    # Service registration
│   └── Services/
│       ├── EmailService.php          # Email sending
│       └── StripeService.php         # Stripe integration
├── config/
│   ├── app.php                       # Application config
│   └── i18n.php                      # Internationalization
├── public/
│   └── index.php                     # Application entry point
├── routes/
│   └── api.php                       # API route definitions
├── storage/
│   ├── app/                          # File storage
│   ├── logs/                         # Application logs
│   └── migrations.json               # Migration definitions
├── .env                              # Environment configuration
├── .githooks/                        # Git hooks for quality checks
├── composer.json                     # PHP dependencies
└── mason                             # CLI tool
```

## Stripe Integration

### Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_CURRENCY=eur
   ```

### Checkout Flow

1. User adds products to basket
2. User initiates checkout: `POST /checkout`
3. API creates Stripe Checkout Session
4. User completes payment on Stripe-hosted page
5. Stripe redirects to success URL
6. Backend verifies payment and creates order

### Webhook Handling (Recommended)

For production, implement Stripe webhooks to handle:
- Successful payments
- Failed payments
- Refunds
- Disputes

## Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Use `QUEUE_DRIVER=database`
- [ ] Set up Redis for caching
- [ ] Configure Stripe live keys
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS allowlist
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set up monitoring

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name shop.example.com;
    root /var/www/shop/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Systemd Queue Worker

Create `/etc/systemd/system/shop-queue.service`:

```ini
[Unit]
Description=Shop Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/shop
ExecStart=/usr/bin/php /var/www/shop/mason queue:work --sleep=3 --max-jobs=1000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable shop-queue
sudo systemctl start shop-queue
```

## License

MIT License - see LICENSE file for details.

## Contributing

This is a project built with BaseAPI. For framework contributions, see the [BaseAPI repository](https://github.com/TimAnthonyAlexander/base-api).

## Support

- **BaseAPI Documentation**: See `baseapi/docs/`
- **Framework Issues**: https://github.com/TimAnthonyAlexander/base-api/issues
- **Stripe Documentation**: https://stripe.com/docs

## Credits

Built with ❤️ using [BaseAPI](https://github.com/TimAnthonyAlexander/base-api) - a tiny, KISS-first PHP 8.4 framework.
