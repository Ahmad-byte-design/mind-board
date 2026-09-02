<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;

it('allows the owner to view a paper', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create(['content' => 'Important note']);

    $this->actingAs($owner)
        ->getJson("/api/v1/papers/{$paper->id}")
        ->assertOk()
        ->assertJsonPath('paper.id', $paper->id)
        ->assertJsonPath('paper.content', 'Important note');
});

it('rejects a non-owner from viewing a paper', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/papers/{$paper->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('papers', ['id' => $paper->id]);
});

it('returns 404 for a nonexistent paper', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/papers/999999')
        ->assertStatus(404);
});

it('rejects unauthenticated access to a paper', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->getJson("/api/v1/papers/{$paper->id}")->assertStatus(401);
});
