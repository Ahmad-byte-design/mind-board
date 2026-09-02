<?php

use App\Models\User;
use Illuminate\Support\Carbon;

it('logs in with correct credentials and returns user without token', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('secret-password'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'secret-password',
    ]);

    $response->assertOk()
        ->assertJsonPath('user.email', 'jane@example.com')
        ->assertJsonMissingPath('token');

    $this->getJson('/api/v1/auth/me')->assertOk();
});

it('rejects a wrong password with a generic message', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('secret-password'),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'wrong-password',
    ])->assertStatus(401)
        ->assertJsonPath('message', 'Invalid credentials.');
});

it('throttles login after the configured number of attempts', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('secret-password'),
    ]);

    for ($i = 0; $i < 10; $i++) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'jane@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(401);
    }

    $this->postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'secret-password',
    ])->assertStatus(429);
});

it('stops throttling a correct password once the window clears', function () {
    Carbon::setTestNow('2024-01-01 00:00:00');

    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => bcrypt('secret-password'),
    ]);

    for ($i = 0; $i < 10; $i++) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'jane@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(401);
    }

    Carbon::setTestNow('2024-01-01 00:02:00');

    $this->postJson('/api/v1/auth/login', [
        'email' => 'jane@example.com',
        'password' => 'secret-password',
    ])->assertOk();

    Carbon::setTestNow();
});
