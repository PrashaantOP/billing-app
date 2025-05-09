<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class RestaurantSwitchController extends Controller
{
    public function switchRestaurant(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
        ]);

        $user = Auth::user();

        // Ensure the user is allowed to switch to this restaurant
        if (!$user->restaurants()->where('restaurant_id', $request->restaurant_id)->exists()) {
            abort(403, 'Unauthorized restaurant switch.');
        }
        $restaurant = Restaurant::where('id', $request->restaurant_id)->first();

        // Set the session value using Facades\Session
        Session::put('current_restaurant_id', $request->restaurant_id);
        Session::put('switched_restaurant', $restaurant);

        return back()->with('success', 'Successfully switched to .' . $restaurant->name);
    }
}
