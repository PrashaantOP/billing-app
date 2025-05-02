<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::where('restaurant_id', Auth::user()->restaurant_id)->with('category')
            ->latest()
            ->paginate(10); // Show 10 per page

        return Inertia::render('backend/menuItems/mainMenuItems', [
            'menuItems' => $menuItems,
        ]);
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
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('assets/images/menuitems', 'public');
            $validated['image'] = $imagePath;
        }

        $menuitem = MenuItem::findOrFail($validated['id']);
        $menuitem->update($validated);

        return back()->with('success', 'Menu item updated successfully.');
    }
}
