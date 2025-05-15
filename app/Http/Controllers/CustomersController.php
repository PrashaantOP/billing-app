<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
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

    public function search(Request $request)
    {
        $query = $request->input('phone');

        $customers = Customer::where('phone', 'like', "$query%")
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'phone', 'email', 'address']);

        return response()->json($customers);
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



    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'phone'   => 'required|string|max:15',
            'name'    => 'nullable|string|max:255',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        // Check if customer with phone exists
        $customer = Customer::where('phone', $validated['phone'])->first();

        if ($customer) {
            // Update customer if additional fields are provided
            $customer->update([
                'name'    => $validated['name'] ?? $customer->name,
                'email'   => $validated['email'] ?? $customer->email,
                'address' => $validated['address'] ?? $customer->address,
            ]);
        } else {
            // Create new customer
            $validated['restaurant_id'] = session('current_restaurant_id');
            $customer = Customer::create($validated);
        }

        Session::put('lastCustomerId', $customer->id);
        return redirect()->back()->with('success', 'Customer added.');
    }

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
