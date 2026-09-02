<?php

use App\Models\User;
use Illuminate\Support\Str;

it('deletes other session rows while keeping the response successful', function () {
    $user = User::factory()->create();

    $currentSessionId = Str::random(40);
    $otherSessionId = Str::random(40);

    $user->sessions()->create([
        'id' => $currentSessionId,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'test',
        'payload' => base64_encode('test'),
        'last_activity' => now()->timestamp,
    ]);

    $user->sessions()->create([
        'id' => $otherSessionId,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'test',
        'payload' => base64_encode('test'),
        'last_activity' => now()->timestamp,
    ]);

    $this->assertDatabaseHas('sessions', ['id' => $otherSessionId]);

    $this->actingAs($user)
        ->postJson('/api/v1/auth/logout-all')
        ->assertOk();

    $this->assertDatabaseMissing('sessions', ['id' => $otherSessionId]);
});
