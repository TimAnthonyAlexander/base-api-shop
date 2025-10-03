<?php

namespace App\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminOrderController extends Controller
{
    public ?string $id = null;

    public ?string $status = null;

    public int $page = 1;

    public int $per_page = 20;

    /**
     * List all orders with optional status filter or get analytics
     */
    #[ResponseType(['orders' => 'array', 'total' => 'int', 'page' => 'int', 'per_page' => 'int'])]
    public function get(): JsonResponse
    {
        // Check if this is an analytics request
        if ($this->request->path === '/admin/analytics') {
            return $this->analytics();
        }

        // Get single order
        if ($this->id !== null) {
            $order = Order::find($this->id);

            if (!$order instanceof Order) {
                return JsonResponse::notFound('Order not found');
            }

            return JsonResponse::ok([
                'order' => $this->formatOrder($order),
            ]);
        }

        if ($this->status !== null && $this->status !== '') {
            $orders = Order::where('status', '=', $this->status)->get();
        } else {
            $orders = Order::all();
        }

        // Sort by created_at descending (newest first)
        usort($orders, fn($a, $b): int => strcmp($b->created_at, $a->created_at));

        $total = count($orders);

        // Simple pagination
        $offset = ($this->page - 1) * $this->per_page;
        $paginatedOrders = array_slice($orders, $offset, $this->per_page);

        $ordersWithDetails = [];
        foreach ($paginatedOrders as $paginatedOrder) {
            assert($paginatedOrder instanceof Order);
            $ordersWithDetails[] = $this->formatOrder($paginatedOrder);
        }

        return JsonResponse::ok([
            'orders' => $ordersWithDetails,
            'total' => $total,
            'page' => $this->page,
            'per_page' => $this->per_page,
        ]);
    }

    /**
     * Update order status
     */
    #[ResponseType(['order' => 'array'])]
    public function put(): JsonResponse
    {
        if ($this->id === null) {
            return JsonResponse::badRequest('Order ID is required');
        }

        $order = Order::find($this->id);

        if (!$order instanceof Order) {
            return JsonResponse::notFound('Order not found');
        }

        $this->validate([
            'status' => 'required|string|in:pending,completed,cancelled,fulfilled',
        ]);

        $order->status = $this->status;
        $order->save();

        return JsonResponse::ok([
            'order' => $this->formatOrder($order),
            'message' => 'Order status updated successfully',
        ]);
    }

    /**
     * Get sales analytics
     */
    #[ResponseType([
        'total_sales' => 'float',
        'total_orders' => 'int',
        'completed_orders' => 'int',
        'pending_orders' => 'int',
        'cancelled_orders' => 'int',
    ])]
    public function analytics(): JsonResponse
    {
        $allOrders = Order::all();

        $totalSales = 0.0;
        $totalOrders = count($allOrders);
        $completedOrders = 0;
        $pendingOrders = 0;
        $cancelledOrders = 0;

        foreach ($allOrders as $allOrder) {
            assert($allOrder instanceof Order);

            if ($allOrder->status === 'completed' || $allOrder->status === 'fulfilled') {
                $totalSales += $allOrder->total_price;
                $completedOrders++;
            } elseif ($allOrder->status === 'pending') {
                $pendingOrders++;
            } elseif ($allOrder->status === 'cancelled') {
                $cancelledOrders++;
            }
        }

        return JsonResponse::ok([
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'pending_orders' => $pendingOrders,
            'cancelled_orders' => $cancelledOrders,
        ]);
    }

    /**
     * Format order data with items
     */
    private function formatOrder(Order $order): array
    {
        $orderData = [
            'id' => $order->id,
            'user_id' => $order->user_id,
            'status' => $order->status,
            'total_price' => $order->total_price,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => [],
        ];

        $items = $order->items()->get();
        foreach ($items as $item) {
            assert($item instanceof OrderItem);
            $product = $item->product()->first();

            if ($product instanceof Product) {
                $images = $product->images()->get();
                $imageUrls = [];
                foreach ($images as $image) {
                    if ($image instanceof ProductImage) {
                        $imageUrls[] = $image->image_path;
                    }
                }

                $itemData = [
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'product' => [
                        'id' => $product->id,
                        'title' => $product->title,
                        'description' => $product->description,
                        'price' => $product->price,
                        'images' => $imageUrls,
                    ],
                ];
                $orderData['items'][] = $itemData;
            }
        }

        return $orderData;
    }
}

