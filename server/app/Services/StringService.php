<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PaperString;
use App\Repositories\Contracts\PaperRepositoryInterface;
use App\Repositories\Contracts\StringRepositoryInterface;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class StringService
{
    public function __construct(
        protected StringRepositoryInterface $stringRepository,
        protected PaperRepositoryInterface $paperRepository,
    ) {}

    public function boardForPage(Page $page): array
    {
        Gate::authorize('view', $page);

        return [
            'papers' => $this->paperRepository->allForPage($page->id),
            'strings' => $this->stringRepository->allForPage($page->id),
        ];
    }

    public function create(Page $page, array $data): PaperString
    {
        Gate::authorize('create', [PaperString::class, $page]);

        $this->ensurePapersBelongToPage($page, $data['paper1_id'], $data['paper2_id']);

        if ($this->stringRepository->existsBetween($data['paper1_id'], $data['paper2_id'])) {
            throw ValidationException::withMessages([
                'paper1_id' => 'A string already connects these two papers.',
            ]);
        }

        return $this->stringRepository->create([
            'paper1_id' => $data['paper1_id'],
            'paper2_id' => $data['paper2_id'],
        ]);
    }

    public function delete(PaperString $paperString): bool
    {
        Gate::authorize('delete', $paperString);

        return $this->stringRepository->delete($paperString);
    }

    public function saveBoard(Page $page, array $data): array
    {
        Gate::authorize('create', [PaperString::class, $page]);

        $createdStrings = [];

        if (isset($data['papers'])) {
            $pagePaperIds = $this->paperRepository->allForPage($page->id)
                ->pluck('id')
                ->all();

            $foreignIds = collect($data['papers'])->pluck('id')->diff($pagePaperIds);

            if ($foreignIds->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'papers' => 'All papers must belong to this page.',
                ]);
            }

            $this->paperRepository->updatePositions($data['papers']);
        }

        if (isset($data['strings'])) {
            foreach ($data['strings'] as $string) {
                $this->ensurePapersBelongToPage($page, $string['paper1_id'], $string['paper2_id']);

                if ($this->stringRepository->existsBetween($string['paper1_id'], $string['paper2_id'])) {
                    continue;
                }

                $createdStrings[] = $this->stringRepository->create([
                    'paper1_id' => $string['paper1_id'],
                    'paper2_id' => $string['paper2_id'],
                ]);
            }
        }

        return ['created_strings' => $createdStrings];
    }

    private function ensurePapersBelongToPage(Page $page, int $paper1Id, int $paper2Id): void
    {
        $paper1 = $this->paperRepository->findById($paper1Id);
        $paper2 = $this->paperRepository->findById($paper2Id);

        if ($paper1Id === $paper2Id) {
            throw ValidationException::withMessages([
                'paper1_id' => 'The two papers must be different.',
            ]);
        }

        if ($paper1 === null || $paper2 === null || $paper1->page_id !== $page->id || $paper2->page_id !== $page->id) {
            throw ValidationException::withMessages([
                'paper1_id' => 'The selected papers must belong to this page.',
                'paper2_id' => 'The selected papers must belong to this page.',
            ]);
        }
    }
}
