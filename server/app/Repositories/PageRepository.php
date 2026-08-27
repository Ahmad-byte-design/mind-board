<?php

namespace App\Repositories;

use App\Models\Page;
use App\Repositories\Contracts\PageRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;

class PageRepository implements PageRepositoryInterface
{
    public function __construct(
        protected Page $model,
    ) {}

    public function listForUser(int $userId, int $perPage = 15): CursorPaginator
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->cursorPaginate($perPage);
    }

    public function findById(int $id): ?Page
    {
        return $this->model->find($id);
    }

    public function create(array $data): Page
    {
        return $this->model->create($data);
    }

    public function update(Page $page, array $data): bool
    {
        return $page->update($data);
    }

    public function delete(Page $page): bool
    {
        return $page->delete();
    }
}
