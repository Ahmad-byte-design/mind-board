<?php

namespace App\Repositories\Contracts;

use App\Models\Page;
use Illuminate\Pagination\CursorPaginator;

interface PageRepositoryInterface
{
    public function listForUser(int $userId, int $perPage = 15): CursorPaginator;

    public function findById(int $id): ?Page;

    public function create(array $data): Page;

    public function update(Page $page, array $data): bool;

    public function delete(Page $page): bool;
}
