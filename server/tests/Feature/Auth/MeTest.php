<?php

use App\Models\User;

it('returns 401 when unauthenticated', function () {
    $this->getJson('/api/v1/auth/me')->assertStatus(401);
});

it('returns the authenticated user data', function () {
    $user = User::factory()->create(['name' => 'Peter Parker']);

    $this->actingAs($user)
        ->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.name', 'Peter Parker')
        ->assertJsonPath('user.email', $user->email);
});

it('does not leak another user data', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonMissingPath('user.email.'.$other->id);
});
