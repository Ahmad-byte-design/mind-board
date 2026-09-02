<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
    ) {}

    public function update(User $user, array $data): User
    {
        if (isset($data['avatar'])) {
            $data['avatar'] = $this->uploadAvatar($user, $data['avatar']);
        }

        $this->userRepository->update($user, $data);

        return $user->fresh();
    }

    protected function uploadAvatar(User $user, UploadedFile $file): string
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        return $file->store('avatars', 'public');
    }
}
