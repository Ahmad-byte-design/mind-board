<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('allows the owner to delete a paper', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($owner)
        ->deleteJson("/api/v1/papers/{$paper->id}")
        ->assertOk();

    $this->assertDatabaseMissing('papers', ['id' => $paper->id]);
});

it('rejects a non-owner from deleting a paper', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();

    $this->actingAs($other)
        ->deleteJson("/api/v1/papers/{$paper->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('papers', ['id' => $paper->id]);
});

it('cascades deletion to connected strings', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper = Paper::factory()->for($page)->create();
    $paperA = Paper::factory()->for($page)->create();
    $paperB = Paper::factory()->for($page)->create();

    $string1 = PaperString::factory()->create([
        'paper1_id' => $paper->id,
        'paper2_id' => $paperA->id,
    ]);
    $string2 = PaperString::factory()->create([
        'paper1_id' => $paperB->id,
        'paper2_id' => $paper->id,
    ]);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/papers/{$paper->id}")
        ->assertOk();

    $this->assertDatabaseMissing('strings', ['id' => $string1->id]);
    $this->assertDatabaseMissing('strings', ['id' => $string2->id]);
    $this->assertDatabaseHas('papers', ['id' => $paperA->id]);
    $this->assertDatabaseHas('papers', ['id' => $paperB->id]);
});
