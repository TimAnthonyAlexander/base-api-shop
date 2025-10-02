<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * Order Model
 */
class Order extends BaseModel
{
    public string $user_id;

    public string $status;

    public static array $indexes = [
        'user_id' => 'index',
        'status' => 'index'
    ];

    public static function createFromBasket(Basket $basket): self
    {
        $order = new self();
        $order->user_id = $basket->user_id;
        $order->status = 'pending';
        $order->save();

        foreach ($basket->items()->get() as $baseModel) {
            assert($baseModel instanceof BasketItem);

            $orderItem = new OrderItem();
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $baseModel->product_id;
            $orderItem->quantity = $baseModel->quantity;
            $orderItem->save();

            // Reduce product stock
            $product = Product::find($baseModel->product_id);
            if ($product instanceof Product) {
                $product->stock -= $baseModel->quantity;
                $product->save();
            }
        }

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
}
