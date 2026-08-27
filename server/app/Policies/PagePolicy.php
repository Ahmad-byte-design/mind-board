<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;

class PagePolicy
{
    public function view(User $user, Page $page): bool
    {
        return $user->id === $page->user_id;
    }

    public function update(User $user, Page $page): bool
    {
        return $user->id === $page->user_id;
    }

    public function delete(User $user, Page $page): bool
    {
        return $user->id === $page->user_id;
    }
}
