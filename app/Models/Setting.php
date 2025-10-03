<?php

namespace App\Models;

use BaseApi\Models\BaseModel;

class Setting extends BaseModel
{
    public string $key = '';

    public string $value = '';

    /**
     * Define indexes for this model
     * @var array<string, string>
     */
    public static array $indexes = [
        'key' => 'unique',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, string $default = ''): string
    {
        $setting = self::query()->where('key', '=', $key)->first();
        return $setting?->value ?? $default;
    }

    /**
     * Set a setting value by key
     */
    public static function set(string $key, string $value): self
    {
        $setting = self::query()->where('key', '=', $key)->first();

        if (!$setting instanceof BaseModel) {
            $setting = new self();
            $setting->key = $key;
        }

        $setting->value = $value;
        $setting->save();

        return $setting;
    }
}
