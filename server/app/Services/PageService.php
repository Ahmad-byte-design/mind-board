<?php

namespace App\Services;

use App\Models\Page;
use App\Repositories\Contracts\PageRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Gate;

class PageService
{
    public function __construct(
        protected PageRepositoryInterface $pageRepository,
    ) {}

    public function listForUser(int $userId, int $perPage = 15): CursorPaginator
    {
        return $this->pageRepository->listForUser($userId, $perPage);
    }

    public function create(int $userId, array $data): Page
    {
        return $this->pageRepository->create([
            'user_id' => $userId,
            'title' => $data['title'],
        ]);
    }

    public function show(Page $page): Page
    {
        Gate::authorize('view', $page);

        return $page;
    }

    public function update(Page $page, array $data): bool
    {
        Gate::authorize('update', $page);

        return $this->pageRepository->update($page, $data);
    }

    public function delete(Page $page): bool
    {
        Gate::authorize('delete', $page);

        return $this->pageRepository->delete($page);
    }
}
