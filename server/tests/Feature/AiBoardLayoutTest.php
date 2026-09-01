<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use App\Services\Ai\KnowledgeGraphGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiBoardLayoutTest extends TestCase
{
    use RefreshDatabase;

    protected function mockGenerator(): void
    {
        $this->app->instance(KnowledgeGraphGenerator::class, new class extends KnowledgeGraphGenerator
        {
            public function generate(string $title): array
            {
                return [
                    'nodes' => [
                        ['id' => 'n1', 'content' => 'Fundamentals'],
                        ['id' => 'n2', 'content' => 'JSX'],
                        ['id' => 'n3', 'content' => 'Components'],
                    ],
                    'edges' => [
                        ['from' => 'n1', 'to' => 'n2'],
                        ['from' => 'n2', 'to' => 'n3'],
                    ],
                ];
            }
        });
    }

    public function test_generated_board_returns_persisted_x_and_y_positions(): void
    {
        $this->mockGenerator();

        $owner = User::factory()->create();
        $page = Page::create(['user_id' => $owner->id, 'title' => 'React Mastery']);

        $response = $this->actingAs($owner)->postJson("/api/v1/pages/{$page->id}/generate");

        $response->assertStatus(201)
            ->assertJsonCount(3, 'papers');

        $papers = collect($response->json('papers'));

        foreach ($papers as $paper) {
            $this->assertIsInt($paper['x'], "paper {$paper['content']} has non-integer x");
            $this->assertIsInt($paper['y'], "paper {$paper['content']} has non-integer y");
            $this->assertNotNull($paper['x']);
            $this->assertNotNull($paper['y']);
        }

        $byContent = $papers->keyBy('content');

        $this->assertSame(0, $byContent['Fundamentals']['y'], 'root concept must sit on the top level');
        $this->assertGreaterThan($byContent['Fundamentals']['y'], $byContent['JSX']['y']);
        $this->assertGreaterThan($byContent['JSX']['y'], $byContent['Components']['y']);

        foreach ($papers as $paper) {
            $this->assertDatabaseHas('papers', [
                'id' => $paper['id'],
                'x' => $paper['x'],
                'y' => $paper['y'],
            ]);
        }
    }
}
