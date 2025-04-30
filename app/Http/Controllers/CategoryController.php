<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('restaurant_id', Auth::user()->restaurant_id)
            ->latest()
            ->paginate(5); // Show 10 per page

        return Inertia::render('backend/categories/mainCategories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $restaurant_id = Auth::user()->restaurant_id;

        // Generate base slug
        $baseSlug = Str::slug($request->name);
        $slug = $baseSlug;
        $count = 1;

        // Ensure slug is unique within the same restaurant
        while (Category::where('slug', $slug)->where('restaurant_id', $restaurant_id)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }

        // Create category
        Category::create([
            'name' => $request->name,
            'slug' => $slug,
            'restaurant_id' => $restaurant_id,
        ]);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($validated['id']);

        // Generate base slug from the new name
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $count = 1;

        // Ensure uniqueness within the same restaurant, excluding current category
        while (
            Category::where('slug', $slug)
            ->where('restaurant_id', $category->restaurant_id)
            ->where('id', '!=', $category->id)
            ->exists()
        ) {
            $slug = $baseSlug . '-' . $count++;
        }

        // Update category
        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
