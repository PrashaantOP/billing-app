<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Administator\PlansController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::get('plans', function () {
    //     return Inertia::render('backend/plans/plans');
    // })->name('plans');

        Route::get('plans', [PlansController::class, 'viewPlans'])
            ->name('plans');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
