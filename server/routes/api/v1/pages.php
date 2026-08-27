<?php

use App\Http\Controllers\Api\PageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', \Illuminate\Session\Middleware\StartSession::class])
    ->apiResource('pages', PageController::class);
