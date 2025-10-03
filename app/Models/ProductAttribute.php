<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * ProductAttribute Model
 */
class ProductAttribute extends BaseModel
{
    public string $product_id;

    public string $attribute;

    public string $value;

    public static array $indexes = [
        'product_id' => 'index',
        'attribute' => 'index'
    ];

    public static array $columns = [
        'value' => ['type' => 'TEXT', 'null' => false]
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

