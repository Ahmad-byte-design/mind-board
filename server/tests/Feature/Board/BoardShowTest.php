<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('returns all papers and strings for the page in one payload', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}/board")
        ->assertOk()
        ->assertJsonCount(2, 'papers')
        ->assertJsonCount(1, 'strings');
});

it('returns empty arrays for an empty page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->getJson("/api/v1/pages/{$page->id}/board")
        ->assertOk()
        ->assertJsonCount(0, 'papers')
        ->assertJsonCount(0, 'strings');
});

it('rejects a non-owner from viewing the board', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}/board")
        ->assertStatus(403);

    $this->assertDatabaseCount('papers', 1);
});
