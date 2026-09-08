<?php

use App\Http\Controllers\Api\BoardController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', StartSession::class])->group(function () {
    Route::get('pages/{page}/board', [BoardController::class, 'show'])->name('pages.board');
    Route::patch('pages/{page}/board', [BoardController::class, 'update'])->name('pages.board.update');
    Route::post('pages/{page}/generate', [BoardController::class, 'generate'])->name('pages.board.generate');
});
