<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        return Inertia::render('backend/invoices/InvoiceDownload');
    }

    /**
     * Return order data for invoice download (JSON for frontend Excel generation).
     * Supports date range filtering.
     */
    public function getOrderData(Request $request)
    {
        $restaurantId = session('current_restaurant_id');

        $request->validate([
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date',
        ]);

        $query = Order::where('restaurant_id', $restaurantId)
            ->with(['customer', 'items.menuItem', 'taxes', 'payments'])
            ->orderBy('created_at');

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $orders = $query->get()->map(function ($order) {
            return [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'order_type'     => $order->order_type,
                'status'         => $order->status,
                'payment_status' => $order->payment_status,
                'subtotal'       => $order->subtotal,
                'tax'            => $order->tax,
                'discount'       => $order->discount ?? 0,
                'total'          => $order->total,
                'created_at'     => $order->created_at?->format('d M Y, h:i A'),
                'customer'       => [
                    'name'  => $order->customer?->name ?? 'Guest',
                    'phone' => $order->customer?->phone ?? '-',
                ],
                'items' => $order->items->map(fn($item) => [
                    'name'        => $item->menuItem?->name ?? '-',
                    'quantity'    => $item->quantity,
                    'price'       => $item->price,
                    'total_price' => $item->total_price,
                ]),
                'taxes' => $order->taxes->map(fn($t) => [
                    'rate'      => $t->rate,
                    'rate_type' => $t->rate_type,
                    'amount'    => $t->amount,
                ]),
                'payment_method' => $order->payments->first()?->payment_method ?? '-',
            ];
        });

        $restaurant = Restaurant::find($restaurantId);

        return response()->json([
            'orders'     => $orders,
            'restaurant' => $restaurant ? [
                'name'    => $restaurant->name,
                'phone'   => $restaurant->phone,
                'email'   => $restaurant->email,
                'address' => $restaurant->address,
                'gst_no'  => $restaurant->gst_no,
            ] : null,
        ]);
    }
}
