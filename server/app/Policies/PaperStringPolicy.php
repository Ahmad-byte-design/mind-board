<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\PaperString;
use App\Models\User;

class PaperStringPolicy
{
    public function create(User $user, Page $page): bool
    {
        return $page->user_id === $user->id;
    }

    public function delete(User $user, PaperString $paperString): bool
    {
        return $paperString->paper1->page->user_id === $user->id
            && $paperString->paper2->page->user_id === $user->id;
    }
}
