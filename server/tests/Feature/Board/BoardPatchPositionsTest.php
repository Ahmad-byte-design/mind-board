<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;

it('updates positions for listed papers and leaves unlisted ones untouched', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $paper1 = Paper::factory()->for($page)->create(['x' => 0, 'y' => 0]);
    $paper2 = Paper::factory()->for($page)->create(['x' => 5, 'y' => 5]);

    $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'papers' => [
                ['id' => $paper1->id, 'x' => 100, 'y' => 200],
            ],
        ])->assertOk();

    $this->assertDatabaseHas('papers', ['id' => $paper1->id, 'x' => 100, 'y' => 200]);
    $this->assertDatabaseHas('papers', ['id' => $paper2->id, 'x' => 5, 'y' => 5]);
});

it('rejects a paper id that does not belong to the page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $otherPage = Page::factory()->for($owner)->create();
    $foreignPaper = Paper::factory()->for($otherPage)->create(['x' => 1, 'y' => 1]);

    $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'papers' => [
                ['id' => $foreignPaper->id, 'x' => 300, 'y' => 400],
            ],
        ])->assertStatus(422);

    $this->assertDatabaseHas('papers', [
        'id' => $paper->id,
        'page_id' => $page->id,
    ]);

    $this->assertDatabaseHas('papers', [
        'id' => $foreignPaper->id,
        'page_id' => $otherPage->id,
        'x' => 1,
        'y' => 1,
    ]);
});

it('rejects a request with neither papers nor strings', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->patchJson("/api/v1/pages/{$page->id}/board", [])
        ->assertStatus(422);
});
