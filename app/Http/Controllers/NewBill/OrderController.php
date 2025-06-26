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

class OrderController extends Controller
{
    public function store(Request $request)
    {
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
            $activeTaxes = \App\Models\Tax::where('restaurant_id', $restaurantId)->get();

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
                    'payment_method' => $data['payment']['method'],
                    'transaction_id' => $data['payment']['transactionId'] ?? null,
                    'amount_paid' => $data['total'],
                    'payment_date' => Carbon::now(),
                    'status' => 'paid',
                ]);
            }

            DB::commit();

            return redirect()->route('orders.store')->with('success', 'Order created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save order: ' . $e->getMessage()]);
        }
    }
}
