<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewBill\CreateNewBillController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('newbill', 'newbill/create-new-bill');
    Route::get('newbill/create-new-bill', [CreateNewBillController::class, 'newBillShow'])->name('newbill.create-new-bill');
    Route::get('newbill/category/{category}', [CreateNewBillController::class, 'getCategoryUsingSlug'])->name('newbill.category.show');

    // Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route::get('settings/store', [StoreController::class, 'edit'])->name('store.edit');
    // Route::patch('/settings/store', [StoreController::class, 'update'])->name('store.update');
    // // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    // Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    // Route::get('settings/appearance', function () {
    //     return Inertia::render('settings/appearance');
    // })->name('appearance');
});
