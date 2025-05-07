<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $currentRestaurantId = session('current_restaurant_id');

        $menuItems = MenuItem::where('restaurant_id', $currentRestaurantId)->with('category')
            ->latest()
            ->paginate(10);

        $categories = Category::where('restaurant_id', session('current_restaurant_id'))->get();
        // dd($categories);

        return Inertia::render('backend/menuItems/mainMenuItems', [
            'menuItems' => $menuItems,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('assets/images/menuitems'), $imageName);
            $validated['image'] = $imageName;
        }
        $validated['restaurant_id'] = session('current_restaurant_id');

        MenuItem::create($validated);

        return back()->with('success', 'Menu item created successfully.');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:menu_items,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'is_available' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $destinationPath = public_path('assets/images/menuitems');

            $image->move($destinationPath, $imageName);
            $validated['image'] = $imageName;
        }

        if (!isset($validated['image'])) {
            unset($validated['image']);
        }

        $menuitem = MenuItem::findOrFail($validated['id']);
        $menuitem->update($validated);

        return back()->with('success', 'Menu item updated successfully.');
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();

        return back()->with('success', 'Item deleted successfully.');
    }
}
