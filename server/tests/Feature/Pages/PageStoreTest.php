<?php

use App\Models\User;

it('creates a page with a valid title', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/pages', ['title' => 'React Mastery'])
        ->assertStatus(201)
        ->assertJsonPath('message', 'Page created successfully.')
        ->assertJsonPath('page.title', 'React Mastery');

    $this->assertDatabaseHas('pages', [
        'user_id' => $user->id,
        'title' => 'React Mastery',
    ]);
});

it('rejects a page without a title', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/pages', [])
        ->assertStatus(422);
});

it('rejects unauthenticated page creation', function () {
    $this->postJson('/api/v1/pages', ['title' => 'React'])
        ->assertStatus(401);
});
