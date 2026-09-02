<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

it('resets the password with a valid token and invalidates old sessions', function () {
    $user = User::factory()->create([
        'email' => 'reset@example.com',
        'password' => bcrypt('old-password'),
    ]);

    $token = Password::broker()->createToken($user);

    $this->postJson('/api/v1/auth/reset-password', [
        'token' => $token,
        'email' => 'reset@example.com',
        'password' => 'NewPassword123!',
        'password_confirmation' => 'NewPassword123!',
    ])->assertOk();

    $user->refresh();

    $this->assertTrue(Hash::check('NewPassword123!', $user->password));

    $this->postJson('/api/v1/auth/login', [
        'email' => 'reset@example.com',
        'password' => 'NewPassword123!',
    ])->assertOk();
});

it('rejects an invalid reset token', function () {
    $user = User::factory()->create([
        'email' => 'reset@example.com',
        'password' => bcrypt('old-password'),
    ]);

    $this->postJson('/api/v1/auth/reset-password', [
        'token' => 'invalid-token-here',
        'email' => 'reset@example.com',
        'password' => 'NewPassword123!',
        'password_confirmation' => 'NewPassword123!',
    ])->assertStatus(422);

    $user->refresh();
    $this->assertTrue(Hash::check('old-password', $user->password));
});
