<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
    ) {}

    public function register(array $data): User
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);

        return $user;
    }

    public function login(array $data): bool
    {
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        $remember = $data['remember'] ?? false;

        return Auth::attempt($credentials, $remember);
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    public function logoutFromAllDevices(): void
    {
        $user = Auth::user();

        if ($user) {
            $user->sessions()->delete();
        }

        $this->logout();
    }

    public function sendPasswordResetLink(string $email): string
    {
        return Password::sendResetLink(
            ['email' => $email],
        );
    }

    public function resetPassword(array $data): string
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            },
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = $this->userRepository->findByEmail($data['email']);
            if ($user) {
                $user->sessions()->delete();
            }
        }

        return $status;
    }

    public function changePassword(User $user, array $data): bool
    {
        if (! Hash::check($data['current_password'], $user->password)) {
            return false;
        }

        $this->userRepository->update($user, [
            'password' => Hash::make($data['password']),
        ]);

        $currentSessionId = request()->session()->getId();

        $user->sessions()
            ->where('id', '!=', $currentSessionId)
            ->delete();

        return true;
    }
}
