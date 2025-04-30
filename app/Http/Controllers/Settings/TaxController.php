<?php

namespace App\Http\Controllers\settings;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TaxController extends Controller
{
    public function index()
    {
        $taxes = Tax::where('restaurant_id', Auth::user()->restaurant_id)->orderBy('created_at', 'desc')->get();

        return Inertia::render('settings/taxes/taxes', [
            'taxes' => $taxes,
        ]);
    }

    /**
     * Store a newly created tax in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('taxes')->where(function ($query) use ($request) {
                    return $query->where('restaurant_id', Auth::user()->restaurant_id);
                }),
            ],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_type' => ['required', 'in:percent,amount'],
            'is_inclusive' => ['required', 'boolean'],
        ]);

        // $validated['restaurant_id'] = Auth::user()->restaurant_id;

        Tax::create([
            'restaurant_id' => Auth::user()->restaurant_id,
            'name' => $validated['name'],
            'rate' => $validated['rate'],
            'rate_type' => $validated['rate_type'],
            'is_inclusive' => $validated['is_inclusive'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Tax added successfully.');
    }

    /**
     * Update the specified tax in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:taxes,id',
            'name' => ['required', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'rate_type' => ['required', 'in:percent,amount'],
            'is_inclusive' => ['required', 'boolean'],
        ]);

        $tax = Tax::findOrFail($validated['id']);

        $tax->update($validated);

        return redirect()->back()->with('success', 'Tax updated successfully.');
    }

    /**
     * Remove the specified tax from storage.
     */
    public function destroy($id)
    {
        $tax = Tax::findOrFail($id);
        $tax->delete();

        return redirect()->back()->with('success', 'Tax deleted successfully.');
    }
}
