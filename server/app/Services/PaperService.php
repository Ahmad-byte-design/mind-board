<?php

namespace App\Services;

use App\Models\Page;
use App\Models\Paper;
use App\Repositories\Contracts\PaperRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Gate;

class PaperService
{
    public function __construct(
        protected PaperRepositoryInterface $paperRepository,
    ) {}

    public function listForPage(Page $page, int $perPage = 50): CursorPaginator
    {
        Gate::authorize('create', [Paper::class, $page]);

        return $this->paperRepository->listForPage($page->id, $perPage);
    }

    public function create(Page $page, array $data): Paper
    {
        Gate::authorize('create', [Paper::class, $page]);

        return $this->paperRepository->create([
            'page_id' => $page->id,
            'content' => $data['content'],
        ]);
    }

    public function show(Paper $paper): Paper
    {
        Gate::authorize('view', $paper);

        return $paper;
    }

    public function update(Paper $paper, array $data): bool
    {
        Gate::authorize('update', $paper);

        return $this->paperRepository->update($paper, $data);
    }

    public function delete(Paper $paper): bool
    {
        Gate::authorize('delete', $paper);

        return $this->paperRepository->delete($paper);
    }
}
