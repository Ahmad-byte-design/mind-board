<?php

use App\Http\Controllers\Api\PageController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', StartSession::class])
    ->apiResource('pages', PageController::class);
