<?php

namespace App\Http\Controllers;

use App\Models\DiningTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiningTableController extends Controller
{
    public function index()
    {
        $restaurantId = session('current_restaurant_id');

        $tables = DiningTable::where('restaurant_id', $restaurantId)->get();

        return Inertia::render('backend/diningTables/mainDiningTable', [
            'tables' => $tables,
        ]);
    }
}
