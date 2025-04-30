<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewBill\CreateNewBillController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;


Route::middleware('auth')->group(function () {

    Route::get('newbill', function () {
        $restaurant = Auth::user()->restaurant;
        $singleCategory = Category::where('restaurant_id', $restaurant->id)->first();

        if ($singleCategory) {
            return redirect('newbill/menu/' . $singleCategory->slug);
        } else {
            return redirect('settings.taxes');
        }
    });
    // Route::redirect('newbill/menu', 'newbill/menu/{$singleCategory->slug}');
    // Route::get('newbill/menu', [CreateNewBillController::class, 'newBillShow'])->name('newbill.create-new-bill');
    Route::get('newbill/menu/{category}', [CreateNewBillController::class, 'getItemUsingSlug'])->name('newbill.items.show');

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
