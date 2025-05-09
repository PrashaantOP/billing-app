<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Administator\PlansController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DiningTableController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Settings\RestaurantSwitchController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/restaurant/switch', [RestaurantSwitchController::class, 'switchRestaurant'])->middleware('auth');


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('plans', [PlansController::class, 'viewPlans'])->name('plans');

    // customers
    Route::get('customers/view', [CustomersController::class, 'index'])->name('customers.view');
    Route::post('/customers', [CustomersController::class, 'store'])->name('customers.store');
    Route::patch('/customers/update', [CustomersController::class, 'update'])->name('customers.update');
    Route::delete('/customer/destroy/{id}', [CustomersController::class, 'destroy'])->name('customer.destroy');

    // categories
    Route::get('menu/categories', [CategoryController::class, 'index'])->name('categories.view');
    Route::post('menu/categories/store', [CategoryController::class, 'store'])->name('category.store');
    Route::patch('/category/update', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('/category/destroy/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');

    // menu items
    Route::get('menu/items', [ProductController::class, 'index'])->name('menu.item.view');
    Route::post('/menu-items/store', [ProductController::class, 'store'])->name('menu.item.store');
    Route::post('/menu-items/udpate', [ProductController::class, 'update'])->name('menu-items.update');
    Route::delete('/menuitem/destroy/{id}', [ProductController::class, 'destroy'])->name('menu.item.destroy');

    // dining tables
    Route::get('/dining-tables', [DiningTableController::class, 'index'])->name('dining.tables.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/newbill.php';
require __DIR__ . '/auth.php';
