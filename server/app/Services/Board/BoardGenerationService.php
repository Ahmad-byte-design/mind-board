<?php

namespace App\Services\Board;

use App\Models\Page;
use App\Repositories\Contracts\PaperRepositoryInterface;
use App\Repositories\Contracts\StringRepositoryInterface;
use App\Services\Ai\KnowledgeGraphGenerator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BoardGenerationService
{
    public function __construct(
        protected KnowledgeGraphGenerator $generator,
        protected PaperRepositoryInterface $paperRepository,
        protected StringRepositoryInterface $stringRepository,
        protected TreeLayoutCalculator $layoutCalculator,
    ) {}

    public function generate(Page $page): array
    {
        Gate::authorize('view', $page);

        $existingPapers = $this->paperRepository->allForPage($page->id);

        if ($existingPapers->isNotEmpty()) {
            throw new HttpException(409, 'This page already has a board.');
        }

        $graph = $this->generator->generate($page->title);

        return DB::transaction(function () use ($page, $graph) {
            [, $tempToReal] = $this->createPapers($page, $graph['nodes']);

            $strings = $this->createStrings($graph['edges'], $tempToReal);

            $positions = $this->layoutCalculator->calculate($graph['nodes'], $graph['edges']);

            $this->persistPositions($tempToReal, $positions);

            return [
                'papers' => $this->paperRepository->allForPage($page->id),
                'strings' => $strings,
            ];
        });
    }

    private function createPapers(Page $page, array $nodes): array
    {
        $papers = collect();
        $tempToReal = [];

        foreach ($nodes as $node) {
            $paper = $this->paperRepository->create([
                'page_id' => $page->id,
                'content' => $node['content'],
            ]);

            $papers->push($paper);
            $tempToReal[$node['id']] = $paper->id;
        }

        return [$papers, $tempToReal];
    }

    private function createStrings(array $edges, array $tempToReal): Collection
    {
        $created = [];
        $seen = [];

        foreach ($edges as $edge) {
            if (! isset($tempToReal[$edge['from']], $tempToReal[$edge['to']])) {
                continue;
            }

            $paper1Id = $tempToReal[$edge['from']];
            $paper2Id = $tempToReal[$edge['to']];

            if ($paper1Id === $paper2Id) {
                continue;
            }

            $key = $paper1Id < $paper2Id ? "{$paper1Id}-{$paper2Id}" : "{$paper2Id}-{$paper1Id}";

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;

            if ($this->stringRepository->existsBetween($paper1Id, $paper2Id)) {
                continue;
            }

            $created[] = $this->stringRepository->create([
                'paper1_id' => $paper1Id,
                'paper2_id' => $paper2Id,
            ]);
        }

        return collect($created);
    }

    private function persistPositions(array $tempToReal, array $positions): void
    {
        $papers = [];

        foreach ($positions as $tempId => $coords) {
            if (! isset($tempToReal[$tempId])) {
                continue;
            }

            $papers[] = [
                'id' => $tempToReal[$tempId],
                'x' => $coords['x'],
                'y' => $coords['y'],
            ];
        }

        $this->paperRepository->updatePositions($papers);
    }
}
