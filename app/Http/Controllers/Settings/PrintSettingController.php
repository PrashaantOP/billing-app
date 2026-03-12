<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\RestaurantPrintSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrintSettingController extends Controller
{
    public function edit()
    {
        $restaurantId = session('current_restaurant_id');

        $settings = RestaurantPrintSetting::firstOrCreate(
            ['restaurant_id' => $restaurantId],
            [
                'print_type'         => 'bill_only',
                'paper_size'         => '80mm',
                'header_text'        => '',
                'footer_text'        => 'Thank you for visiting!',
                'show_logo'          => true,
                'show_tax_details'   => true,
                'show_customer_info' => true,
                'show_order_type'    => true,
                'font_size'          => 'medium',
            ]
        );

        return Inertia::render('settings/print', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $restaurantId = session('current_restaurant_id');

        $validated = $request->validate([
            'print_type'         => 'required|in:bill_only,kot_bill',
            'paper_size'         => 'required|in:58mm,80mm,A4,A5',
            'header_text'        => 'nullable|string|max:500',
            'footer_text'        => 'nullable|string|max:500',
            'show_logo'          => 'boolean',
            'show_tax_details'   => 'boolean',
            'show_customer_info' => 'boolean',
            'show_order_type'    => 'boolean',
            'font_size'          => 'required|in:small,medium,large',
        ]);

        RestaurantPrintSetting::updateOrCreate(
            ['restaurant_id' => $restaurantId],
            $validated
        );

        return back()->with('success', 'Print settings saved successfully.');
    }
}
