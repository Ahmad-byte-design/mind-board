<?php

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;
use App\Services\Ai\KnowledgeGraphGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\Fakes\FakeKnowledgeGraphGenerator;

uses(RefreshDatabase::class);

function fakeGenerator(callable $behaviour): FakeKnowledgeGraphGenerator
{
    Http::fake();

    $generator = new FakeKnowledgeGraphGenerator;
    $generator->generateUsing($behaviour);

    app()->instance(KnowledgeGraphGenerator::class, $generator);

    return $generator;
}

it('generates a board on an empty page with valid x and y positions', function () {
    fakeGenerator(fn () => [
        'nodes' => [
            ['id' => 'n1', 'content' => 'Root Concept'],
            ['id' => 'n2', 'content' => 'Child A'],
            ['id' => 'n3', 'content' => 'Child B'],
        ],
        'edges' => [
            ['from' => 'n1', 'to' => 'n2'],
            ['from' => 'n1', 'to' => 'n3'],
        ],
    ]);

    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create(['title' => 'Machine Learning']);

    $response = $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/generate")
        ->assertStatus(201)
        ->assertJsonCount(3, 'papers')
        ->assertJsonCount(2, 'strings');

    $papers = collect($response->json('papers'));

    foreach ($papers as $paper) {
        $this->assertIsInt($paper['x']);
        $this->assertIsInt($paper['y']);
        $this->assertNotNull($paper['x']);
        $this->assertNotNull($paper['y']);
    }

    $this->assertDatabaseCount('papers', 3);
    $this->assertDatabaseCount('strings', 2);
});

it('places the root concept at the minimum y value', function () {
    fakeGenerator(fn () => [
        'nodes' => [
            ['id' => 'n1', 'content' => 'Root'],
            ['id' => 'n2', 'content' => 'Middle'],
            ['id' => 'n3', 'content' => 'Leaf'],
        ],
        'edges' => [
            ['from' => 'n1', 'to' => 'n2'],
            ['from' => 'n2', 'to' => 'n3'],
        ],
    ]);

    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $response = $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/generate")
        ->assertStatus(201);

    $papers = collect($response->json('papers'));
    $byContent = $papers->keyBy('content');

    $minY = $papers->min('y');

    $this->assertSame($minY, $byContent['Root']['y']);
});

it('rejects generation on a page that already has papers and creates nothing', function () {
    fakeGenerator(fn () => [
        'nodes' => [
            ['id' => 'n1', 'content' => 'Existing'],
        ],
        'edges' => [],
    ]);

    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();
    Paper::factory()->for($page)->create(['content' => 'Pre-existing paper']);

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/generate")
        ->assertStatus(409);

    $this->assertDatabaseCount('papers', 1);
    $this->assertDatabaseCount('strings', 0);
});

it('handles malformed generator output without partial creation', function () {
    Http::fake();
    $generator = (new FakeKnowledgeGraphGenerator)->throwingMalformedOutput();
    app()->instance(KnowledgeGraphGenerator::class, $generator);

    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/generate")
        ->assertStatus(422);

    $this->assertDatabaseCount('papers', 0);
    $this->assertDatabaseCount('strings', 0);
});

it('handles an edge referencing a nonexistent node without partial creation', function () {
    fakeGenerator(fn () => [
        'nodes' => [
            ['id' => 'n1', 'content' => 'Node A'],
        ],
        'edges' => [
            ['from' => 'n1', 'to' => 'n999'],
        ],
    ]);

    $owner = User::factory()->create();
    $page = Page::factory()->for($owner)->create();

    $response = $this->actingAs($owner)
        ->postJson("/api/v1/pages/{$page->id}/generate");

    $response->assertStatus(201);

    $this->assertDatabaseCount('papers', 1);
    $this->assertDatabaseCount('strings', 0);
});

it('never calls the generator for a non-owner', function () {
    $generator = new FakeKnowledgeGraphGenerator;
    app()->instance(KnowledgeGraphGenerator::class, $generator);

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $page = Page::factory()->for($owner)->create(['title' => 'React']);

    $this->actingAs($other)
        ->postJson("/api/v1/pages/{$page->id}/generate")
        ->assertStatus(403);

    $this->assertDatabaseCount('papers', 0);
    $this->assertDatabaseCount('strings', 0);
});
