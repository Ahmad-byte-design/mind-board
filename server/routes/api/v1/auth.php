<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\PasswordController;
use App\Http\Controllers\Api\Auth\ProfileController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {

    // Public routes
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware(['throttle:10,1', StartSession::class])
        ->name('auth.register');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware(['throttle:10,1', StartSession::class])
        ->name('auth.login');

    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword'])
        ->middleware('throttle:10,1')
        ->name('auth.forgot-password');

    Route::post('/reset-password', [PasswordController::class, 'resetPassword'])
        ->middleware('throttle:10,1')
        ->name('auth.reset-password');

    // Authenticated routes
    Route::middleware(['auth:sanctum', StartSession::class])->group(function () {

        Route::get('/me', [AuthController::class, 'me'])
            ->name('auth.me');

        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        Route::post('/logout-all', [AuthController::class, 'logoutAll'])
            ->name('auth.logout-all');

        Route::put('/change-password', [PasswordController::class, 'changePassword'])
            ->name('auth.change-password');

        Route::put('/profile', [ProfileController::class, 'update'])
            ->name('auth.profile');
    });
});
