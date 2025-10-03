<?php

namespace App\Controllers;

use App\Models\Setting;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Admin')]
class AdminThemeController extends Controller
{
    public string $theme = '';

    #[ResponseType(['theme' => 'string'])]
    public function get(): JsonResponse
    {
        $theme = Setting::get('active_theme', 'luxury');

        return JsonResponse::ok(['theme' => $theme]);
    }

    #[ResponseType(['theme' => 'string'])]
    public function post(): JsonResponse
    {
        $this->validate([
            'theme' => 'required|string',
        ]);

        $validThemes = ['luxury', 'monochrome', 'noir', 'graphite', 'platinum', 'eink'];
        if (!in_array($this->theme, $validThemes, true)) {
            return JsonResponse::error(
                'Theme must be one of: ' . implode(', ', $validThemes),
                400
            );
        }

        Setting::set('active_theme', $this->theme);

        return JsonResponse::ok(['theme' => $this->theme]);
    }
}
