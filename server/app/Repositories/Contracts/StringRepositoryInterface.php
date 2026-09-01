<?php

namespace App\Repositories\Contracts;

use App\Models\PaperString;
use Illuminate\Support\Collection;

interface StringRepositoryInterface
{
    public function allForPage(int $pageId): Collection;

    public function findById(int $id): ?PaperString;

    public function existsBetween(int $paper1Id, int $paper2Id): bool;

    public function create(array $data): PaperString;

    public function delete(PaperString $paperString): bool;
}
