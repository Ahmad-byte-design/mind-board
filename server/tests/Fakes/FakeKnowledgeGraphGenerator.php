<?php

namespace Tests\Fakes;

use App\Exceptions\AiGenerationException;
use App\Services\Ai\KnowledgeGraphGenerator;

class FakeKnowledgeGraphGenerator extends KnowledgeGraphGenerator
{
    protected ?\Closure $generator = null;

    protected bool $throwMalformed = false;

    public function generateUsing(callable $callback): static
    {
        $this->generator = \Closure::bind($callback, $this);

        return $this;
    }

    public function generateValidGraph(): static
    {
        return $this->generateUsing(fn () => [
            'nodes' => [
                ['id' => 'n1', 'content' => 'Fundamentals'],
                ['id' => 'n2', 'content' => 'Core Concepts'],
                ['id' => 'n3', 'content' => 'Advanced Topics'],
            ],
            'edges' => [
                ['from' => 'n1', 'to' => 'n2'],
                ['from' => 'n2', 'to' => 'n3'],
            ],
        ]);
    }

    public function throwingMalformedOutput(): static
    {
        $this->throwMalformed = true;

        return $this;
    }

    public function generateWithBadEdgeReference(): static
    {
        return $this->generateUsing(fn () => [
            'nodes' => [
                ['id' => 'n1', 'content' => 'Node A'],
            ],
            'edges' => [
                ['from' => 'n1', 'to' => 'n999'],
            ],
        ]);
    }

    public function generate(string $title): array
    {
        if ($this->throwMalformed) {
            throw new AiGenerationException(422, 'The AI returned malformed output. Please try again.');
        }

        if ($this->generator) {
            return ($this->generator)($title);
        }

        return parent::generate($title);
    }
}
