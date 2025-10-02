<?php

namespace App\Controllers;

use App\Models\Basket;
use App\Models\Order;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * OrderController
 * 
 * Add your controller description here.
 */
class OrderController extends Controller
{
    public string $id;

    public function get(): JsonResponse
    {
        $order = Order::find($this->id);

        if (!$order instanceof Order) {
            return JsonResponse::notFound('Order not found');
        }

        if (!$order->user_id === $this->request->user['id']) {
            return JsonResponse::forbidden('You do not own this order');
        }

        return JsonResponse::ok([
            'order' => $order,
        ]);
    }

    public function post(): JsonResponse
    {
        $basket = Basket::where('user_id', '=', $this->request->user['id'])->first();

        if (!$basket instanceof Basket) {
            return JsonResponse::badRequest('No basket found for user');
        }

        $order = Order::createFromBasket($basket)
            ->deleteBasket($basket);

        return JsonResponse::created([
            'order' => $order,
        ]);
    }
}
