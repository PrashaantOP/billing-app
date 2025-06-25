<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiningTable;

class ApiDiningTableController extends Controller
{
    public function index()
    {
        $restaurantId = session('current_restaurant_id');
        return DiningTable::select('id', 'name')->where('restaurant_id', $restaurantId)->get();
    }
}
