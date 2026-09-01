<?php

use App\Http\Controllers\Api\PaperController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', StartSession::class])->group(function () {
    Route::apiResource('pages.papers', PaperController::class)->only(['index', 'store']);
    Route::apiResource('papers', PaperController::class)->only(['show', 'update', 'destroy']);
});
