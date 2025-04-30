<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Product;
use App\Models\Tax;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateNewBillController extends Controller
{
    public function newBillShow()
    {
        $restaurant = Auth::user()->restaurant;
        $categories = category::where('restaurant_id', $restaurant->id)->get();

        // taxes
        $taxes = Tax::where('restaurant_id', $restaurant->id)->where('is_inclusive', 1)->get();

        $singleCategory = category::where('restaurant_id', $restaurant->id)->first();
        if (!$singleCategory) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $menuItems = MenuItem::where('category_id', $singleCategory->id)
            // ->with(['restaurant', 'category'])
            ->get();
        return Inertia::render('backend/newbill/createNewBill', [
            'categories' => $categories,
            'menuitems' => $menuItems,
            'taxes' => $taxes,
            'categoryname' => $singleCategory->name,
        ]);
    }

    public function getItemUsingSlug($slug)
    {
        $restaurant = Auth::user()->restaurant;
        $categories = category::where('restaurant_id', $restaurant->id)->get();
        if (!$categories) {
            return Inertia::location(route('taxes.index'));
        }
        $taxes = Tax::where('restaurant_id', $restaurant->id)
            ->where('is_inclusive', true)
            ->get();
        $singleCategory = Category::where('slug', $slug)->where('restaurant_id', $restaurant->id)->first();

        // taxes
        $taxes = Tax::where('restaurant_id', $restaurant->id)->where('is_inclusive', 1)->get();
        // dd($taxes);

        if (!$singleCategory) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $menuItems = MenuItem::where('category_id', $singleCategory->id)
            // ->with(['restaurant', 'category'])
            ->get();

        return Inertia::render('backend/newbill/createNewBill', [
            'categories' => $categories,
            'menuitems' => $menuItems,
            'taxes' => $taxes,
            'categoryname' => $singleCategory->name,
            'taxes' => $taxes,
        ]);
    }
}
