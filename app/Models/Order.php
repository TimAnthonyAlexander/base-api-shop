<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Database\Relations\HasMany;
use BaseApi\Models\BaseModel;

/**
 * Order Model
 */
class Order extends BaseModel
{
    public string $user_id;

    public string $status;

    public float $total_price = 0.0;

    public static array $indexes = [
        'user_id' => 'index',
        'status' => 'index'
    ];

    public static function createFromBasket(Basket $basket): self
    {
        $order = new self();
        $order->user_id = $basket->user_id;
        $order->status = 'pending';
        $order->total_price = 0.0;
        $order->save(); // Save order first to get valid ID
        
        $totalPrice = 0.0;

        foreach ($basket->items()->get() as $baseModel) {
            assert($baseModel instanceof BasketItem);

            $product = Product::find($baseModel->product_id);
            if ($product instanceof Product) {
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->product_id = $baseModel->product_id;
                $orderItem->quantity = $baseModel->quantity;
                $orderItem->price = $product->price; // Store price at time of order
                $orderItem->save();

                $totalPrice += $product->price * $baseModel->quantity;

                // Reduce product stock
                $product->stock -= $baseModel->quantity;
                $product->save();
            }
        }

        $order->total_price = $totalPrice;
        $order->save(); // Update with final total

        return $order;
    }

    public function deleteBasket(Basket $basket): self
    {
        foreach ($basket->items()->get() as $baseModel) {
            assert($baseModel instanceof BasketItem);

            $baseModel->delete();
        }

        $basket->delete();

        return $this;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
