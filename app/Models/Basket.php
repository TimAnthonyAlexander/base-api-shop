<?php

namespace App\Models;

use BaseApi\Database\Relations\BelongsTo;
use BaseApi\Models\BaseModel;

/**
 * Basket Model
 */
class Basket extends BaseModel
{
    public string $user_id;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
