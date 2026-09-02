<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('creates new strings from the strings array', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    $response = $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'strings' => [
                ['paper1_id' => $paper1->id, 'paper2_id' => $paper2->id],
            ],
        ])->assertOk();

    $this->assertDatabaseHas('strings', [
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->assertCount(1, $response->json('created_strings'));
});

it('skips an already-connected pair idempotently in either direction', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $response = $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'strings' => [
                ['paper1_id' => $paper2->id, 'paper2_id' => $paper1->id],
            ],
        ])->assertOk();

    $this->assertDatabaseCount('strings', 1);
    $this->assertCount(0, $response->json('created_strings'));
});

it('rejects a strings pair referencing papers from a different page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();

    $otherPage = Page::factory()->for($owner)->create();
    $foreignPaper = Paper::factory()->for($otherPage)->create();

    $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'strings' => [
                ['paper1_id' => $paper1->id, 'paper2_id' => $foreignPaper->id],
            ],
        ])->assertStatus(422);

    $this->assertDatabaseCount('strings', 0);
});

it('rejects a self-connection in the strings array', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'strings' => [
                ['paper1_id' => $paper->id, 'paper2_id' => $paper->id],
            ],
        ])->assertStatus(422);

    $this->assertDatabaseCount('strings', 0);
});
