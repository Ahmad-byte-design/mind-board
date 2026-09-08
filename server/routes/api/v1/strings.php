<?php

use App\Http\Controllers\Api\StringController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', StartSession::class])->group(function () {
    Route::apiResource('pages.strings', StringController::class)->only('store');
    Route::apiResource('strings', StringController::class)->only('destroy');
});
