<?php

namespace App\Models;

use BaseApi\Database\Relations\HasMany;
use BaseApi\Models\BaseModel;

/**
 * Product Model
 */
class Product extends BaseModel
{
    public string $title;

    public ?string $description = null;

    public ?string $longDescription = null;

    public float $price = 0.0;

    public int $stock = 0;

    public int $views = 0;

    public ?string $variant_group = null;

    public static array $indexes = [
        'title' => 'index',
        'price' => 'index',
        'stock' => 'index',
        'views' => 'index',
        'variant_group' => 'index',
    ];

    public static array $columns = [
        'description' => ['type' => 'TEXT', 'nullable' => true],
        'longDescription' => ['type' => 'LONGTEXT', 'nullable' => true],
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }
}
