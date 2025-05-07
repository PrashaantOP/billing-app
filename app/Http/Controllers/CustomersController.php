<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomersController extends Controller
{
    public function index()
    {
        $customers = Customer::where('restaurant_id', session('current_restaurant_id'))
            ->latest()
            ->paginate(10); // Show 10 per page

        return Inertia::render('backend/customers/customers', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|min:10|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        Customer::create([
            'restaurant_id' => session('current_restaurant_id'),
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
        ]);

        return redirect()->back()->with('success', 'Customer added.');
    }



    // public function update(Request $request, Customer $customer)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'phone' => 'nullable|string',
    //         'email' => 'nullable|email',
    //         'address' => 'nullable|string',
    //     ]);

    //     $customer->update($request->only('name', 'phone', 'email', 'address'));

    //     return redirect()->back()->with('success', 'Customer updated.');
    // }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:customers,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'nullable|string|max:1000',
        ]);

        $customer = Customer::findOrFail($validated['id']);
        $customer->update($validated);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return back()->with('success', 'Customer deleted successfully.');
    }
}
