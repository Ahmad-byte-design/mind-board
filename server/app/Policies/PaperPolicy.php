<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\Paper;
use App\Models\User;

class PaperPolicy
{
    public function view(User $user, Paper $paper): bool
    {
        return $paper->page->user_id === $user->id;
    }

    public function create(User $user, Page $page): bool
    {
        return $page->user_id === $user->id;
    }

    public function update(User $user, Paper $paper): bool
    {
        return $paper->page->user_id === $user->id;
    }

    public function delete(User $user, Paper $paper): bool
    {
        return $paper->page->user_id === $user->id;
    }
}
