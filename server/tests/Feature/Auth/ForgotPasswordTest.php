<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

it('queues a password reset notification for a valid email', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'reset@example.com']);

    $this->postJson('/api/v1/auth/forgot-password', [
        'email' => 'reset@example.com',
    ])->assertOk();

    Notification::assertSentTo($user, ResetPassword::class);
});

it('returns 422 for an unknown email (the app reveals whether an email exists)', function () {
    $this->postJson('/api/v1/auth/forgot-password', [
        'email' => 'nonexistent@example.com',
    ])->assertStatus(422);
});

it('returns 422 for an invalid email format', function () {
    $this->postJson('/api/v1/auth/forgot-password', [
        'email' => 'not-an-email',
    ])->assertStatus(422);
});
