<?php

namespace App\Controllers;

use App\Models\Basket;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;

/**
 * OrderController
 * 
 * Add your controller description here.
 */
class OrderController extends Controller
{
    public ?string $id = null;

    public function get(): JsonResponse
    {
        if ($this->id === null) {
            $orders = Order::where('user_id', '=', $this->request->user['id'])->get();

            // Manually load items and calculate totals
            $ordersWithDetails = [];
            foreach ($orders as $order) {
                assert($order instanceof Order);
                $orderData = [
                    'id' => $order->id,
                    'user_id' => $order->user_id,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'items' => [],
                    'total' => 0.0,
                ];

                foreach ($order->items()->get() as $baseModel) {
                    assert($baseModel instanceof OrderItem);
                    $product = $baseModel->product()->first();

                    if ($product instanceof Product) {
                        $itemData = [
                            'id' => $baseModel->id,
                            'order_id' => $baseModel->order_id,
                            'product_id' => $baseModel->product_id,
                            'quantity' => $baseModel->quantity,
                            'product' => [
                                'id' => $product->id,
                                'title' => $product->title,
                                'description' => $product->description,
                                'price' => $product->price,
                            ],
                        ];
                        $orderData['items'][] = $itemData;
                        $orderData['total'] += $product->price * $baseModel->quantity;
                    }
                }

                $ordersWithDetails[] = $orderData;
            }

            return JsonResponse::ok([
                'orders' => $ordersWithDetails,
            ]);
        }

        $order = Order::find($this->id);

        if (!$order instanceof Order) {
            return JsonResponse::notFound('Order not found');
        }

        if ($order->user_id !== $this->request->user['id']) {
            return JsonResponse::forbidden('You do not own this order');
        }

        // Build order details with items
        $orderData = [
            'id' => $order->id,
            'user_id' => $order->user_id,
            'status' => $order->status,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => [],
            'total' => 0.0,
        ];

        foreach ($order->items()->get() as $baseModel) {
            assert($baseModel instanceof OrderItem);
            $product = $baseModel->product()->first();

            if ($product instanceof Product) {
                $itemData = [
                    'id' => $baseModel->id,
                    'order_id' => $baseModel->order_id,
                    'product_id' => $baseModel->product_id,
                    'quantity' => $baseModel->quantity,
                    'product' => [
                        'id' => $product->id,
                        'title' => $product->title,
                        'description' => $product->description,
                        'price' => $product->price,
                    ],
                ];
                $orderData['items'][] = $itemData;
                $orderData['total'] += $product->price * $baseModel->quantity;
            }
        }

        return JsonResponse::ok([
            'order' => $orderData,
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
