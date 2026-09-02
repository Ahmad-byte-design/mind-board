<?php

use App\Models\Page;
use App\Models\User;

it('allows an owner to view a page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create(['title' => 'My Page']);

    $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}")
        ->assertOk()
        ->assertJsonPath('page.id', $page->id)
        ->assertJsonPath('page.title', 'My Page');
});

it('rejects a different authenticated user from viewing the page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('pages', ['id' => $page->id]);
});

it('rejects unauthenticated access to a page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->getJson("/api/v1/pages/{$page->id}")->assertStatus(401);
});

it('returns 404 for a nonexistent page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/pages/999999')
        ->assertStatus(404);
});
