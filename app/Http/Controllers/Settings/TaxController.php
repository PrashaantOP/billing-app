<?php

namespace App\Http\Controllers\settings;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaxController extends Controller
{
    public function index()
    {
        $taxes = Tax::orderBy('created_at', 'desc')->get();

        return Inertia::render('settings/taxes', [
            'taxes' => $taxes,
        ]);
    }

    /**
     * Store a newly created tax in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_type' => ['required', 'in:percent,amount'],
            'is_inclusive' => ['required', 'boolean'],
        ]);

        $validated['restaurant_id'] = Auth::user()->restaurant_id; // if you have multi-restaurant support

        Tax::create($validated);

        return redirect()->back()->with('success', 'Tax added successfully.');
    }

    /**
     * Update the specified tax in storage.
     */
    public function update(Request $request, Tax $tax)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_type' => ['required', 'in:percent,amount'],
            'is_inclusive' => ['required', 'boolean'],
        ]);

        $tax->update($validated);

        return redirect()->back()->with('success', 'Tax updated successfully.');
    }

    /**
     * Remove the specified tax from storage.
     */
    public function destroy(Tax $tax)
    {
        $tax->delete();

        return redirect()->back()->with('success', 'Tax deleted successfully.');
    }
}
