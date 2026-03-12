<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $restaurantId = session('current_restaurant_id');

        $payments = Payment::where('restaurant_id', $restaurantId)->with('order.items.menuItem')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('backend/payments/PaymentList', [
            'payments' => $payments
        ]);
    }

    public function updateNotes(Request $request, Payment $payment)
    {
        $request->validate(['notes' => 'nullable|string|max:1000']);

        $restaurantId = session('current_restaurant_id');
        if ($payment->restaurant_id !== $restaurantId) {
            abort(403);
        }

        $payment->update(['notes' => $request->notes]);

        return back()->with('success', 'Notes updated successfully.');
    }
}
