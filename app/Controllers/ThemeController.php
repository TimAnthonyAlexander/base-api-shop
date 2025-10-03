<?php

namespace App\Controllers;

use App\Models\Setting;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;

#[Tag('Public')]
class ThemeController extends Controller
{
    #[ResponseType(['theme' => 'string'])]
    public function get(): JsonResponse
    {
        $theme = Setting::get('active_theme', 'luxury');

        return JsonResponse::ok(['theme' => $theme]);
    }
}
