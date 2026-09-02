<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('creates a string for a valid pair on the same page', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper1->id,
            'paper2_id' => $paper2->id,
        ])->assertStatus(201)
        ->assertJsonPath('message', 'String created successfully.')
        ->assertJsonPath('string.paper1_id', $paper1->id)
        ->assertJsonPath('string.paper2_id', $paper2->id);

    $this->assertDatabaseHas('strings', [
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);
});

it('rejects papers from different pages', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();

    $otherPage = Page::factory()->for($owner)->create();
    $foreignPaper = Paper::factory()->for($otherPage)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper1->id,
            'paper2_id' => $foreignPaper->id,
        ])->assertStatus(422);

    $this->assertDatabaseCount('strings', 0);
});

it('rejects the same paper twice', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper->id,
            'paper2_id' => $paper->id,
        ])->assertStatus(422);

    $this->assertDatabaseCount('strings', 0);
});

it('rejects an already-connected pair in either direction', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper2->id,
            'paper2_id' => $paper1->id,
        ])->assertStatus(422);

    $this->assertDatabaseCount('strings', 1);
});

it('rejects a non-owner from creating a string', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->postJson("/api/v1/pages/{$page->id}/strings", [
            'paper1_id' => $paper1->id,
            'paper2_id' => $paper2->id,
        ])->assertStatus(403);

    $this->assertDatabaseCount('strings', 0);
});
