<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

it('invalidates the session after logout', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('secret-password'),
    ]);

    $this->actingAs($user);

    $this->postJson('/api/v1/auth/logout')
        ->assertOk()
        ->assertJsonPath('message', 'Logged out successfully.');

    Auth::forgetGuards();

    $this->getJson('/api/v1/auth/me')->assertStatus(401);
});
