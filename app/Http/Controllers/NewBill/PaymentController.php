<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
