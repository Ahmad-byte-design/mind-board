<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

it('rejects a wrong current password and does not change the password', function () {
    $user = User::factory()->create(['password' => bcrypt('current-password')]);

    $this->actingAs($user)
        ->putJson('/api/v1/auth/change-password', [
            'current_password' => 'wrong-password',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertStatus(422)
        ->assertJsonPath('message', 'Current password is incorrect.');

    $user->refresh();
    $this->assertTrue(Hash::check('current-password', $user->password));
});

it('changes the password and invalidates other sessions while keeping the current one', function () {
    $user = User::factory()->create(['password' => bcrypt('current-password')]);

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

    $this->actingAs($user)
        ->putJson('/api/v1/auth/change-password', [
            'current_password' => 'current-password',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk()
        ->assertJsonPath('message', 'Password changed successfully.');

    $user->refresh();
    $this->assertTrue(Hash::check('NewPassword123!', $user->password));

    $this->assertDatabaseMissing('sessions', ['id' => $otherSessionId]);

    $this->getJson('/api/v1/auth/me')->assertOk();
});
