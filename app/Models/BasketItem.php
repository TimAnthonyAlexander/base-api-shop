<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * BasketItem Model
 */
class BasketItem extends BaseModel
{
    // Add your model properties here
    // Example:
    // public string $name = '';
    // public ?string $email = null;
    // public bool $active = true;
    public string $basket_id;

    // Optional: Define custom table name
    // protected static ?string $table = 'BasketItem_table';

    // Optional: Define indexes (used by migrations)
    // public static array $indexes = [
    //     'email' => 'unique',        // Creates unique index
    //     'created_at' => 'index',    // Creates regular index
    //     'status' => 'index'
    // ];

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
    public function basket(): BelongsTo
    {
        return $this->belongsTo(Basket::class);
    }

    // hasMany (one-to-many) - this model has many of another
    // Example: User has many Posts
    // /** @var Post[] */
    // public array $posts = [];  // Add this property for the relation
    //
    // public function posts(): HasMany  
    // {
    //     return $this->hasMany(Post::class);
    // }

    // Usage examples:
    // $model = BasketItem::find('some-id');
    // $relatedModel = $model->user()->get();  // Get related model
    // $relatedModels = $model->posts()->get(); // Get array of related models
    // 
    // Eager loading:
    // $modelsWithRelations = BasketItem::with(['user', 'posts'])->get();
}

