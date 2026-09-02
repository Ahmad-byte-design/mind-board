<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;

it('returns only papers on the requested page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    Paper::factory()->count(2)->for($page)->create();

    $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}/papers")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('rejects access to papers on another user page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}/papers")
        ->assertStatus(403);

    $this->assertDatabaseHas('papers', ['page_id' => $page->id]);
});

it('paginates papers and provides a next_cursor when there are more', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    Paper::factory()->count(20)->for($page)->create();

    $response = $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}/papers?per_page=15")
        ->assertOk()
        ->assertJsonCount(15, 'data');

    $this->assertNotNull($response->json('meta.next_cursor'));
});

it('omits next_cursor on the last page of papers', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    Paper::factory()->count(3)->for($page)->create();

    $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}/papers?per_page=15")
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('meta.next_cursor', null);
});
