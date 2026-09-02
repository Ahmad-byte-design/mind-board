<?php

use App\Models\Page;
use App\Models\User;

it('allows an owner to update a page title', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create(['title' => 'Old Title']);

    $this->actingAs($owner)
        ->putJson("/api/v1/pages/{$page->id}", ['title' => 'New Title'])
        ->assertOk()
        ->assertJsonPath('page.title', 'New Title');

    $this->assertDatabaseHas('pages', [
        'id' => $page->id,
        'title' => 'New Title',
    ]);
});

it('rejects a non-owner from updating a page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create(['title' => 'Owner Title']);

    $this->actingAs($other)
        ->putJson("/api/v1/pages/{$page->id}", ['title' => 'Hacked'])
        ->assertStatus(403);

    $this->assertDatabaseHas('pages', [
        'id' => $page->id,
        'title' => 'Owner Title',
    ]);
});
