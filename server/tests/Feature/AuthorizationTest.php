<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('denies a second user access to every owner-scoped page endpoint', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('pages', ['id' => $page->id]);
});

it('denies a second user access to every owner-scoped paper endpoint', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}/papers")
        ->assertStatus(403);

    $this->assertDatabaseHas('papers', ['id' => $paper->id]);
});

it('denies a second user access to every owner-scoped board endpoint', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->getJson("/api/v1/pages/{$page->id}/board")
        ->assertStatus(403);

    $this->actingAs($other)
        ->patchJson("/api/v1/pages/{$page->id}/board", [
            'papers' => [['id' => $paper->id, 'x' => 1, 'y' => 1]],
        ])->assertStatus(403);

    $this->assertDatabaseHas('papers', ['id' => $paper->id]);
});

it('denies a second user access to every owner-scoped string endpoint', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();
    $string = PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($other)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper1->id,
            'paper2_id' => $paper2->id,
        ])->assertStatus(403);

    $this->actingAs($other)
        ->deleteJson("/api/v1/strings/{$string->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('strings', ['id' => $string->id]);
    $this->assertDatabaseHas('papers', ['id' => $paper1->id]);
    $this->assertDatabaseHas('papers', ['id' => $paper2->id]);
});
