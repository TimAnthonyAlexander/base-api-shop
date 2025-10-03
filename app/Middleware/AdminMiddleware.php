<?php

declare(strict_types=1);

namespace App\Middleware;

use Override;
use BaseApi\Http\Middleware;
use BaseApi\Http\Request;
use BaseApi\Http\Response;
use BaseApi\Http\JsonResponse;

/**
 * Middleware to verify user has admin role.
 * Should be used after AuthMiddleware to check role.
 */
class AdminMiddleware implements Middleware
{
    #[Override]
    public function handle(Request $request, callable $next): Response
    {
        // Get user from request (set by AuthMiddleware)
        $user = $request->user ?? null;

        if (!$user) {
            return JsonResponse::error('Unauthorized', 401);
        }

        // Check if user has admin role
        if (!isset($user['role']) || $user['role'] !== 'admin') {
            return JsonResponse::error('Admin access required', 403);
        }

        return $next($request);
    }
}
