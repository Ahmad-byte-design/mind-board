<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\PaperString;
use App\Models\User;

it('allows the owner to delete a string', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();
    $string = PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/strings/{$string->id}")
        ->assertOk();

    $this->assertDatabaseMissing('strings', ['id' => $string->id]);
});

it('rejects a non-owner from deleting a string', function () {
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
        ->deleteJson("/api/v1/strings/{$string->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('strings', ['id' => $string->id]);
});

it('does not delete its connected papers when a string is deleted', function () {
    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    $paper1 = Paper::factory()->for($page)->create();
    $paper2 = Paper::factory()->for($page)->create();
    $string = PaperString::factory()->create([
        'paper1_id' => $paper1->id,
        'paper2_id' => $paper2->id,
    ]);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/strings/{$string->id}")
        ->assertOk();

    $this->assertDatabaseHas('papers', ['id' => $paper1->id]);
    $this->assertDatabaseHas('papers', ['id' => $paper2->id]);
});
