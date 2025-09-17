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

        $tables = \App\Models\DiningTable::where('restaurant_id', $restaurantId)
            ->with(['restaurant:id,name', 'currentDineinOrder:id,dining_table_id,status,order_type,order_number'])
            ->get()
            ->map(function ($table) {
                $table->is_reserved = (bool) $table->currentDineinOrder;
                return $table;
            });

        return Inertia::render('backend/diningTables/mainDiningTable', [
            'tables' => $tables,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        DiningTable::create($validated);

        return redirect()->back()->with('success', 'Dining table added successfully!');
    }

    public function update(Request $request, DiningTable $dining_table)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);
        $dining_table->update($validated);
        return redirect()->back()->with('success', 'Dining table updated!');
    }
}
