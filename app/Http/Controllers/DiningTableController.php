<?php

namespace App\Http\Controllers;

use App\Models\DiningTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiningTableController extends Controller
{
    public function index()
    {
        $tables = DiningTable::all();

        return Inertia::render('backend/diningTables/mainDiningTable', [
            'tables' => $tables,
        ]);
    }
}
