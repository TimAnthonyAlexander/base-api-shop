<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * BasketItem Model
 */
class BasketItem extends BaseModel
{
    public string $basket_id;

    public string $product_id;

    public int $quantity = 1;

    public function basket(): BelongsTo
    {
        return $this->belongsTo(Basket::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
