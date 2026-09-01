<?php

namespace App\Repositories;

use App\Models\Paper;
use App\Models\PaperString;
use App\Repositories\Contracts\StringRepositoryInterface;
use Illuminate\Support\Collection;

class StringRepository implements StringRepositoryInterface
{
    public function __construct(
        protected PaperString $model,
    ) {}

    public function allForPage(int $pageId): Collection
    {
        $paperIds = Paper::query()->where('page_id', $pageId)->select('id');

        return $this->model
            ->whereIn('paper1_id', $paperIds)
            ->orWhereIn('paper2_id', $paperIds)
            ->orderByDesc('id')
            ->get();
    }

    public function findById(int $id): ?PaperString
    {
        return $this->model->find($id);
    }

    public function existsBetween(int $paper1Id, int $paper2Id): bool
    {
        return $this->model
            ->where(function ($query) use ($paper1Id, $paper2Id) {
                $query->where('paper1_id', $paper1Id)->where('paper2_id', $paper2Id);
            })
            ->orWhere(function ($query) use ($paper1Id, $paper2Id) {
                $query->where('paper1_id', $paper2Id)->where('paper2_id', $paper1Id);
            })
            ->exists();
    }

    public function create(array $data): PaperString
    {
        return $this->model->create($data);
    }

    public function delete(PaperString $paperString): bool
    {
        return $paperString->delete();
    }
}
