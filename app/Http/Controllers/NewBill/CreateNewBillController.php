<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateNewBillController extends Controller
{
    public function newBillShow()
    {
        $store = Auth::user()->store;
        $categories = Product::where('store_id', $store->id)->get();

        return Inertia::render('backend/newbill/createNewBill', [
            'categories' => $categories,
        ]);
    }
}
