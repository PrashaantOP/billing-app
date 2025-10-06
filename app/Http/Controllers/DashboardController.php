<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $restaurant = session('switched_restaurant');
        if (!$restaurant) {
            return redirect()->route('restaurant.switch');
        }

        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $last30Days = Carbon::now()->subDays(30);

        // Section Cards Data
        $totalRevenue = Order::where('restaurant_id', $restaurant->id)
            ->where('payment_status', 'paid')
            ->sum('total');

        $monthlyRevenue = Order::where('restaurant_id', $restaurant->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('total');

        $lastMonthRevenue = Order::where('restaurant_id', $restaurant->id)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('total');

        $revenueGrowth = $lastMonthRevenue > 0
            ? round((($monthlyRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $totalOrders = Order::where('restaurant_id', $restaurant->id)->count();
        $todayOrders = Order::where('restaurant_id', $restaurant->id)
            ->whereDate('created_at', $today)
            ->count();

        $totalCustomers = Customer::where('restaurant_id', $restaurant->id)->count();
        $newCustomersThisMonth = Customer::where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $pendingOrders = Order::where('restaurant_id', $restaurant->id)
            ->where('payment_status', 'pending')
            ->count();

        $sectionCardsData = [
            [
                'label' => 'Total Revenue',
                'value' => '₹' . number_format($totalRevenue, 2),
                'delta' => ($revenueGrowth >= 0 ? '+' : '') . $revenueGrowth . '%',
                'trend' => $revenueGrowth >= 0 ? 'up' : 'down',
                'footer' => $revenueGrowth >= 0 ? 'Growing this month' : 'Down this month',
                'help' => 'Compared to last month'
            ],
            [
                'label' => 'Total Orders',
                'value' => $totalOrders,
                'delta' => '+' . $todayOrders,
                'trend' => 'up',
                'footer' => 'Orders today: ' . $todayOrders,
                'help' => 'All time orders'
            ],
            [
                'label' => 'Total Customers',
                'value' => $totalCustomers,
                'delta' => '+' . $newCustomersThisMonth,
                'trend' => 'up',
                'footer' => 'New this month',
                'help' => 'Customer base growth'
            ],
            [
                'label' => 'Pending Payments',
                'value' => $pendingOrders,
                'delta' => $pendingOrders > 0 ? 'Needs attention' : 'All clear',
                'trend' => $pendingOrders > 0 ? 'down' : 'up',
                'footer' => $pendingOrders > 0 ? 'Follow up required' : 'No pending bills',
                'help' => 'Payment status overview'
            ],
        ];

        // Chart Data - Last 30 days with all 3 order types
        // First get orders grouped by date and type
        $ordersData = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(CASE WHEN order_type = "dinein" THEN 1 END) as dinein'),
            DB::raw('COUNT(CASE WHEN order_type = "takeaway" THEN 1 END) as takeaway'),
            DB::raw('COUNT(CASE WHEN order_type = "delivery" THEN 1 END) as delivery')
        )
            ->where('restaurant_id', $restaurant->id)
            ->where('created_at', '>=', $last30Days)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Generate complete date range (last 30 days) with 0 values for missing dates
        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayData = $ordersData->get($date);

            $chartData[] = [
                'date' => $date,
                'dinein' => $dayData ? (int)$dayData->dinein : 0,
                'takeaway' => $dayData ? (int)$dayData->takeaway : 0,
                'delivery' => $dayData ? (int)$dayData->delivery : 0,
            ];
        }

        $chartConfig = [
            'visitors' => ['label' => 'Orders'],
            'dinein' => ['label' => 'Dine In', 'color' => 'hsl(var(--chart-1))'],
            'takeaway' => ['label' => 'Takeaway', 'color' => 'hsl(var(--chart-2))'],
            'delivery' => ['label' => 'Delivery', 'color' => 'hsl(var(--chart-3))'],
        ];

        // Recent Orders for Table
        $recentOrders = Order::with(['customer', 'user'])
            ->where('restaurant_id', $restaurant->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_no' => $order->order_number,
                    'customer' => $order->customer->name ?? 'Walk-in Customer',
                    'amount' => $order->total,
                    'status' => ucfirst($order->payment_status),
                    'date' => $order->created_at->format('M d, Y H:i'),
                    'type' => ucfirst($order->order_type),
                ];
            });

        // Analytics Summary
        $analyticsData = [
            [
                'metric' => 'Today Orders',
                'value' => $todayOrders,
                'change' => 'Today',
                'status' => 'neutral'
            ],
            [
                'metric' => 'This Month Revenue',
                'value' => '₹' . number_format($monthlyRevenue, 2),
                'change' => ($revenueGrowth >= 0 ? '+' : '') . $revenueGrowth . '%',
                'status' => $revenueGrowth >= 0 ? 'up' : 'down'
            ],
            [
                'metric' => 'Average Order Value',
                'value' => '₹' . number_format($totalOrders > 0 ? $totalRevenue / $totalOrders : 0, 2),
                'change' => 'All time avg',
                'status' => 'neutral'
            ],
            [
                'metric' => 'Completion Rate',
                'value' => Order::where('restaurant_id', $restaurant->id)->where('status', 'completed')->count() . '/' . $totalOrders,
                'change' => 'Orders completed',
                'status' => 'up'
            ],
        ];

        return Inertia::render('dashboard', [
            'sectionCardsData' => $sectionCardsData,
            'chartData' => $chartData,
            'chartConfig' => $chartConfig,
            'recentOrders' => $recentOrders,
            'analyticsData' => $analyticsData,
            'restaurant' => $restaurant
        ]);
    }
}
