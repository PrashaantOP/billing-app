<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\StaffController;
use App\Http\Controllers\Settings\StoreController;
use App\Http\Controllers\Settings\TaxController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\AdminOrManagerOnly;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::match(['patch', 'post'], '/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/store', [StoreController::class, 'edit'])->middleware(AdminOrManagerOnly::class)->name('store.edit');
    Route::match(['patch', 'post'], '/settings/store', [StoreController::class, 'update'])
        ->middleware(AdminOrManagerOnly::class)
        ->name('store.update');
    // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/taxes', [TaxController::class, 'index'])->name('taxes.index');
    Route::post('settings/taxes', [TaxController::class, 'store'])->name('taxes.store');
    Route::patch('settings/taxes/update', [TaxController::class, 'update'])->name('taxes.update');
    Route::delete('settings/destroy/{tax}', [TaxController::class, 'destroy'])->name('taxes.destroy');


    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::resource('staff', StaffController::class)->middleware(AdminOrManagerOnly::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
