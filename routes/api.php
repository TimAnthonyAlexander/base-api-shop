<?php

use App\Controllers\AdminThemeController;
use App\Controllers\BasketController;
use BaseApi\App;
use App\Controllers\CheckoutCancelController;
use App\Controllers\CheckoutSuccessController;
use App\Controllers\HealthController;
use App\Controllers\LoginController;
use App\Controllers\LogoutController;
use App\Controllers\MeController;
use App\Controllers\SignupController;
use App\Controllers\FileUploadController;
use App\Controllers\OpenApiController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\ProductSearchController;
use App\Controllers\ProductRecommendationsController;
use App\Controllers\ThemeController;
use App\Middleware\AdminMiddleware;
use BaseApi\Http\Middleware\AuthMiddleware;
use BaseApi\Http\Middleware\RateLimitMiddleware;

$router = App::router();

// Product endpoints
$router->get(
    '/products',
    [
        ProductController::class,
    ],
);

$router->get(
    '/products/search',
    [
        ProductSearchController::class,
    ],
);

$router->get(
    '/products/recommendations',
    [
        ProductRecommendationsController::class,
    ],
);

$router->get(
    '/product/{id}',
    [
        AuthMiddleware::class,
        ProductController::class,
    ],
);

$router->post(
    '/product',
    [
        AuthMiddleware::class,
        ProductController::class,
    ],
);

$router->get(
    '/basket',
    [
        AuthMiddleware::class,
        BasketController::class,
    ],
);

$router->post(
    '/basket',
    [
        AuthMiddleware::class,
        BasketController::class,
    ],
);

$router->get(
    '/orders',
    [
        AuthMiddleware::class,
        OrderController::class,
    ],
);

$router->get(
    '/order/{id}',
    [
        AuthMiddleware::class,
        OrderController::class,
    ],
);

$router->post(
    '/order',
    [
        AuthMiddleware::class,
        OrderController::class,
    ],
);

$router->get(
    '/checkout/success',
    [
        CheckoutSuccessController::class,
    ],
);

$router->get(
    '/checkout/cancel',
    [
        CheckoutCancelController::class,
    ],
);

// ================================
// Public Endpoints (No Auth)
// ================================

// Health check
$router->get('/health', [
    RateLimitMiddleware::class => ['limit' => '60/1m'],
    HealthController::class,
]);

// Get current theme (public)
$router->get('/theme', [
    ThemeController::class,
]);

// ================================  
// Authentication Endpoints
// ================================

// User registration
$router->post('/auth/signup', [
    RateLimitMiddleware::class => ['limit' => '5/1m'],
    SignupController::class,
]);

// User login
$router->post('/auth/login', [
    RateLimitMiddleware::class => ['limit' => '10/1m'],
    LoginController::class,
]);

// User logout (supports both session and API token auth)
$router->post('/auth/logout', [
    AuthMiddleware::class,
    LogoutController::class,
]);

// ================================
// Protected Endpoints ( Auth)
// ================================

// Get current user info (supports both session and API token)
$router->get('/me', [
    AuthMiddleware::class,
    MeController::class,
]);

$router->post('/me', [
    AuthMiddleware::class,
    MeController::class,
]);

// ================================
// File Upload Examples
// ================================

// Basic file upload
$router->post('/files/upload', [
    AuthMiddleware::class,
    RateLimitMiddleware::class => ['limit' => '10/1m'],
    FileUploadController::class,
]);

// Get file info
$router->get('/files/info', [
    AuthMiddleware::class,
    FileUploadController::class,
]);

// Delete files
$router->delete('/files', [
    AuthMiddleware::class,
    FileUploadController::class,
]);

// ================================
// Admin Endpoints
// ================================

// Get current theme
$router->get('/admin/theme', [
    AuthMiddleware::class,
    AdminMiddleware::class,
    AdminThemeController::class,
]);

// Update theme
$router->post('/admin/theme', [
    AuthMiddleware::class,
    AdminMiddleware::class,
    RateLimitMiddleware::class => ['limit' => '10/1m'],
    AdminThemeController::class,
]);

// ================================
// Development Only
// ================================

if (App::config('app.env') === 'local') {
    // OpenAPI schema for API documentation
    $router->get('/openapi.json', [OpenApiController::class]);
}
