<?php

namespace App\Controllers;

use App\Models\User;
use BaseApi\Controllers\Controller;
use BaseApi\Http\JsonResponse;
use BaseApi\Http\Attributes\ResponseType;
use BaseApi\Http\Attributes\Tag;
use BaseApi\App;

#[Tag('Authentication')]
class MeController extends Controller
{
    public string $name = '';

    public string $email = '';

    public string $address = '';

    #[ResponseType(['user' => 'array'])]
    public function get(): JsonResponse
    {
        $userId = $_SESSION['user_id'] ?? null;

        if (!$userId) {
            return JsonResponse::error('Not authenticated', 401);
        }

        // Use the user provider to get user details
        $user = App::userProvider()->byId($userId);

        if (!$user) {
            return JsonResponse::error('User not found', 404);
        }

        return JsonResponse::ok(['user' => $user]);
    }

    public function post(): JsonResponse
    {
        $this->validate([
            'name' => 'string|max:255',
            'email' => 'email|max:255',
            'address' => 'string|max:500',
        ]);

        $hasChanges = false;

        $user = App::userProvider()->byId($_SESSION['user_id'] ?? '');

        if (!$user) {
            return JsonResponse::error('User not found', 404);
        }

        if ($this->name !== '' && $this->name !== $user['name']) {
            $user['name'] = $this->name;
            $hasChanges = true;
        }

        if ($this->email !== '' && $this->email !== $user['email']) {
            $user['email'] = $this->email;
            $hasChanges = true;
        }

        if ($this->address !== '' && $this->address !== $user['address']) {
            $user['address'] = $this->address;
            $hasChanges = true;
        }

        if ($hasChanges) {
            $userModel = User::find($user['id']);

            if (!$userModel instanceof User) {
                return JsonResponse::error('User not found', 404);
            }

            $userModel->name = $user['name'];
            $userModel->email = $user['email'];
            $userModel->address = $user['address'];
            $userModel->save();
        }

        return JsonResponse::ok(['user' => $user]);
    }
}
