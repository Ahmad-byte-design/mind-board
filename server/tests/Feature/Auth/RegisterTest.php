<?php

use App\Models\User;

it('registers a user and starts a session', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('message', 'Registration successful.')
        ->assertJsonPath('user.email', 'john@example.com')
        ->assertJsonMissingPath('token');

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
    ]);

    $this->getJson('/api/v1/auth/me')->assertOk();
});

it('rejects a duplicate email', function () {
    User::factory()->create(['email' => 'same@example.com']);

    $this->postJson('/api/v1/auth/register', [
        'name' => 'John Doe',
        'email' => 'same@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ])->assertStatus(422);
});

it('rejects a weak password', function () {
    $this->postJson('/api/v1/auth/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'weak',
        'password_confirmation' => 'weak',
    ])->assertStatus(422);
});

it('rejects missing fields', function () {
    $this->postJson('/api/v1/auth/register', [
        'email' => 'john@example.com',
    ])->assertStatus(422);
});
