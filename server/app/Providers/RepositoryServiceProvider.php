<?php

namespace App\Providers;

use App\Models\Page;
use App\Models\User;
use App\Repositories\Contracts\PageRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\PageRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            fn () => new UserRepository(new User),
        );

        $this->app->bind(
            PageRepositoryInterface::class,
            fn () => new PageRepository(new Page),
        );
    }
}
