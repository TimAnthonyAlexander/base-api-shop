<?php

namespace App\Models;

use BaseApi\Models\BaseModel;

/**
 * Product Model
 */
class Product extends BaseModel
{
    public string $title;

    public ?string $description = null;

    public float $price = 0.0;

    public int $stock = 0;

    public static array $indexes = [
        'title' => 'index',
        'price' => 'index',
    ];
}
