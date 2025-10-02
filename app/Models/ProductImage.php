<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * ProductImage Model
 */
class ProductImage extends BaseModel
{
    public string $product_id;

    public string $image_path;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

