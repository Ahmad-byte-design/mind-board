<?php

use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\StringController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', StartSession::class])->group(function () {
    Route::apiResource('pages.strings', StringController::class)->only('store');
    Route::apiResource('strings', StringController::class)->only('destroy');
    
    Route::get('pages/{page}/board', [BoardController::class, 'show'])->name('pages.board');
    Route::patch('pages/{page}/board', [BoardController::class, 'update'])->name('pages.board.update');
    Route::post('pages/{page}/generate', [BoardController::class, 'generate'])->name('pages.board.generate');
});
