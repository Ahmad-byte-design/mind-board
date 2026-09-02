<?php

use App\Models\Page;
use App\Models\User;

it('returns only the authenticated user pages', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    Page::factory()->count(2)->for($owner)->create();
    Page::factory()->for($other)->create();

    $this->actingAs($owner)
        ->getJson('/api/v1/pages')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonMissingPath('data.2');
});

it('paginates pages and provides a next_cursor when there are more pages', function () {
    $owner = User::factory()->create();

    Page::factory()->count(20)->for($owner)->create();

    $response = $this->actingAs($owner)
        ->getJson('/api/v1/pages?per_page=15')
        ->assertOk()
        ->assertJsonCount(15, 'data');

    $this->assertNotNull($response->json('meta.next_cursor'));
});

it('omits next_cursor on the last page', function () {
    $owner = User::factory()->create();

    Page::factory()->count(5)->for($owner)->create();

    $this->actingAs($owner)
        ->getJson('/api/v1/pages?per_page=15')
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.next_cursor', null);
});

it('orders pages newest-first', function () {
    $owner = User::factory()->create();

    $older = Page::factory()->for($owner)->create();
    $newer = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->getJson('/api/v1/pages')
        ->assertOk()
        ->assertJsonPath('data.0.id', $newer->id)
        ->assertJsonPath('data.1.id', $older->id);
});
