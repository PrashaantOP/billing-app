<?php

namespace App\Http\Controllers\NewBill;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTax;
use App\Models\Payment;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // dd($request->all());
        $data = $request->validate([
            'order_type' => 'required|in:dinein,takeaway,delivery',
            'dining_table_id' => 'nullable|exists:dining_tables,id',
            'customer' => 'required|array',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',

            'discount_type' => 'nullable|in:percent,fixed',
            'discount_value' => 'nullable|numeric',
            'discount' => 'nullable|numeric',

            'subtotal' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'payment_status' => 'required|in:pending,paid,partial',
            'payment' => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $restaurantId = session('current_restaurant_id');
            if (!$restaurantId) {
                throw new \Exception('Restaurant context missing.');
            }

            // Handle Customer
            $customerId = null;
            if (!empty($data['customer']['phone'])) {
                $customer = \App\Models\Customer::firstOrCreate(
                    ['phone' => $data['customer']['phone']],
                    ['name' => $data['customer']['name'] ?? 'Guest']
                );
                $customerId = $customer->id;
            }

            // Create Order
            $order = Order::create([
                'restaurant_id' => $restaurantId,
                'order_number' => 'ORD-' . strtoupper(Str::random(6)),
                'order_type' => $data['order_type'],
                'dining_table_id' => $data['dining_table_id'],
                'customer_id' => $customerId,
                'user_id' => auth()->id(),
                'status' => 'pending',
                'subtotal' => $data['subtotal'],
                'tax' => $data['tax'],
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'discount' => $data['discount'],
                'total' => $data['total'],
                'payment_status' => $data['payment_status'],
            ]);

            // Order Items
            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total_price' => $item['total_price'],
                ]);
            }

            // 💰 Handle Taxes
            $activeTaxes = \App\Models\Tax::where('restaurant_id', $restaurantId)->where('is_inclusive', 1)->get();

            $discountedSubtotal = $data['subtotal'] - ($data['discount'] ?? 0);
            foreach ($activeTaxes as $tax) {
                $rate = (float)$tax->rate;
                $amount = $tax->rate_type === 'percent'
                    ? ($discountedSubtotal * $rate / 100)
                    : $rate;

                $order->taxes()->create([
                    'restaurant_id' => $restaurantId,
                    // 'order_id' => $order->id,
                    'tax_id' => $tax->id,
                    'rate' => $rate,
                    'rate_type' => $tax->rate_type,
                    'amount' => $amount,
                ]);
            }

            // 💳 Payment
            if (!empty($data['payment']) && $data['payment']['isPaid']) {
                $order->payments()->create([
                    'restaurant_id' => $restaurantId,
                    'payment_method' => $data['payment']['method'] ?? 'Cash',
                    'transaction_reference' => $data['payment']['transactionId'],
                    'transaction_id' => $data['payment']['transactionId'] ?? null,
                    'amount_paid' => $data['total'],
                    'status' => $data['payment_status'],
                    'payment_date' => Carbon::now(),
                    'status' => 'paid',
                ]);
            }

            DB::commit();

            return back()->with('success', 'Order created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save order: ' . $e->getMessage()]);
        }
    }

    public function viewOderPage(Request $request)
    {
        $restaurantId = session('current_restaurant_id');
        $search = $request->input('search');

        $ordersQuery = \App\Models\Order::where('restaurant_id', $restaurantId)->with('items.menuItem')
            ->where('status', '!=', 'completed')
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

        return \Inertia\Inertia::render('backend/orders/OrderMain', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function getMenuItems($restaurantId)
    {
        $menuItems = MenuItem::where('restaurant_id', $restaurantId)
            ->where('is_available', true)
            ->select('id', 'name', 'price', 'is_available')
            ->get();

        return response()->json($menuItems);
    }



    public function updateOrderType(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_type' => 'required|in:dinein,takeaway,delivery',
            'status' => 'required|in:pending,preparing,served,completed,cancelled',
        ]);

        $order->update([
            'order_type' => $validated['order_type'],
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Order updated successfully.');
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,partial',
        ]);

        $order->payment_status = $request->payment_status;
        $order->save();

        // Find existing payment (if any)
        $payment = $order->payments()->first();

        // If status is "paid" OR "pending" OR "partial"
        if ($payment) {
            // Always update payment record to match order payment_status
            $payment->status = $request->payment_status;
            // Amount paid logic:
            if ($request->payment_status == 'paid') {
                $payment->amount_paid = $order->total;
            } elseif ($request->payment_status == 'partial') {
                // Put your partial logic here, e.g.
                // $payment->amount_paid = $yourPartialAmount;
            } else { // pending
                $payment->amount_paid = 0;
                $payment->status = 'paid';
            }
            $payment->payment_date = now();
            $payment->save();
        } else {
            // Only create a row if fully paid, or you may create row for all statuses as needed
            if ($request->payment_status == 'paid') {
                $order->payments()->create([
                    'restaurant_id' => $order->restaurant_id,
                    'order_id'      => $order->id,
                    'payment_date'  => now(),
                    'amount_paid'   => $order->total,
                    'payment_method' => 'Cash', // or from $request
                    'status'        => 'paid',
                ]);
            }
            // Optionally handle row creation for "partial"/"pending" if needed
        }
        return back()->with('success', 'Updated successfully.');
        // return response()->json([
        //     'success' => true,
        //     'payment_status' => $order->payment_status
        // ]);
    }
}
