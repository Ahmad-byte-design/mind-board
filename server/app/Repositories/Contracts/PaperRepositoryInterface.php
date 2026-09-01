<?php

namespace App\Repositories\Contracts;

use App\Models\Paper;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Collection;

interface PaperRepositoryInterface
{
    public function listForPage(int $pageId, int $perPage = 15): CursorPaginator;

    public function allForPage(int $pageId): Collection;

    public function findById(int $id): ?Paper;

    public function create(array $data): Paper;

    public function update(Paper $paper, array $data): bool;

    public function delete(Paper $paper): bool;

    public function updatePositions(array $positions): void;
}
