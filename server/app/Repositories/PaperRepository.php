<?php

namespace App\Repositories;

use App\Models\Paper;
use App\Repositories\Contracts\PaperRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Collection;

class PaperRepository implements PaperRepositoryInterface
{
    public function __construct(
        protected Paper $model,
    ) {}

    public function listForPage(int $pageId, int $perPage = 500): CursorPaginator
    {
        return $this->model
            ->where('page_id', $pageId)
            ->orderByDesc('id')
            ->cursorPaginate($perPage);
    }

    public function allForPage(int $pageId): Collection
    {
        return $this->model
            ->where('page_id', $pageId)
            ->orderByDesc('id')
            ->get();
    }

    public function findById(int $id): ?Paper
    {
        return $this->model->find($id);
    }

    public function create(array $data): Paper
    {
        return $this->model->create($data);
    }

    public function update(Paper $paper, array $data): bool
    {
        return $paper->update($data);
    }

    public function delete(Paper $paper): bool
    {
        return $paper->delete();
    }

    public function updatePositions(array $positions): void
    {
        foreach ($positions as $position) {
            $this->model
                ->whereKey($position['id'])
                ->update([
                    'x' => $position['x'],
                    'y' => $position['y'],
                ]);
        }
    }
}
