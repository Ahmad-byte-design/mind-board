<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;

it('allows the owner to update a paper', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create(['content' => 'Old content']);

    $this->actingAs($owner)
        ->putJson("/api/v1/papers/{$paper->id}", ['content' => 'New content'])
        ->assertOk()
        ->assertJsonPath('paper.content', 'New content');

    $this->assertDatabaseHas('papers', [
        'id' => $paper->id,
        'content' => 'New content',
    ]);
});

it('rejects a non-owner from updating a paper', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create(['content' => 'Original']);

    $this->actingAs($other)
        ->putJson("/api/v1/papers/{$paper->id}", ['content' => 'Hacked'])
        ->assertStatus(403);

    $this->assertDatabaseHas('papers', [
        'id' => $paper->id,
        'content' => 'Original',
    ]);
});
