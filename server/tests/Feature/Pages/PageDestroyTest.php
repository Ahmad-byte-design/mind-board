<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('allows an owner to delete a page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->deleteJson("/api/v1/pages/{$page->id}")
        ->assertOk();

    $this->assertDatabaseMissing('pages', ['id' => $page->id]);
});

it('rejects a non-owner from deleting a page', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($other)
        ->deleteJson("/api/v1/pages/{$page->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('pages', ['id' => $page->id]);
});

it('cascades deletion to papers and strings', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    $string = PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/pages/{$page->id}")
        ->assertOk();

    $this->assertDatabaseMissing('papers', ['id' => $paper1->id]);
    $this->assertDatabaseMissing('papers', ['id' => $paper2->id]);
    $this->assertDatabaseMissing('strings', ['id' => $string->id]);
});
