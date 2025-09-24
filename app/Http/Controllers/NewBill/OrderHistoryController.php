<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderHistoryController extends Controller
{
    public function viewOrderHistory(Request $request)
    {
        $restaurantId = session('current_restaurant_id');

        $search = $request->input('search');

        $ordersQuery = \App\Models\Order::where('restaurant_id', $restaurantId)->with('items.menuItem')
            ->where('status', 'completed') // ADD THIS LINE for completed orders only
            ->with('customer', 'diningTable');

        if ($search) {
            $ordersQuery->where(function ($query) use ($search) {
                // Search in customer name or phone
                $query->whereHas('customer', function ($q) use ($search) {
                    $q->where('name', 'like', "%$search%")
                        ->orWhere('phone', 'like', "%$search%");
                })
                    // Or match by order_number directly
                    ->orWhere('order_number', 'like', "%$search%");
            });
        }

        $orders = $ordersQuery->latest()->paginate(6)->withQueryString();

        return \Inertia\Inertia::render('backend/orders/OrderHistory', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
