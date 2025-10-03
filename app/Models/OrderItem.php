<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Database\Relations\HasMany;
use BaseApi\Models\BaseModel;

/**
 * OrderItem Model
 */
class OrderItem extends BaseModel
{
    // Add your model properties here
    // Example:
    // public string $name = '';
    // public ?string $email = null;
    // public bool $active = true;
    public string $order_id;

    public string $product_id;

    public int $quantity = 1;

    public float $price = 0.0;

    // Optional: Define custom table name
    // protected static ?string $table = 'OrderItem_table';

    // Optional: Define indexes (used by migrations)
    // public static array $indexes = [
    //     'email' => 'unique',        // Creates unique index
    //     'created_at' => 'index',    // Creates regular index
    //     'status' => 'index'
    // ];
    public static array $indexes = [
        'order_id' => 'index',
        'product_id' => 'index'
    ];

    // Optional: Define column overrides (used by migrations)
    // public static array $columns = [
    //     'name' => ['type' => 'VARCHAR(120)', 'null' => false],
    //     'description' => ['type' => 'TEXT', 'null' => true],
    //     'price' => ['type' => 'DECIMAL(10,2)', 'default' => '0.00']
    // ];

    // Relations Examples:

    // belongsTo (many-to-one) - this model belongs to another
    // Example: Post belongs to User
    // public ?User $user = null;  // Add this property for the relation
    // 
    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
