<?php

use App\Models\Page;
use App\Models\User;

it('creates a paper on an owned page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/papers", ['content' => 'Some note'])
        ->assertStatus(201)
        ->assertJsonPath('paper.content', 'Some note');

    $this->assertDatabaseHas('papers', [
        'page_id' => $page->id,
        'content' => 'Some note',
    ]);
});

it('rejects creating a paper on another user page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($other)
        ->postJson("/api/v1/pages/{$page->id}/papers", ['content' => 'Hacked note'])
        ->assertStatus(403);

    $this->assertDatabaseCount('papers', 0);
});

it('rejects a paper without content', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/papers", [])
        ->assertStatus(422);
});
