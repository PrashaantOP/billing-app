<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RestaurantController extends Controller
{


    public function index()
    {
        // $user = Auth::user();

        // Assuming user has a many-to-many relationship with restaurants
        $restaurants = Auth::user()->restaurants()->paginate(10);

        return Inertia::render('backend/restaurants/mainRestaurants', [
            'restaurants' => $restaurants,
            'current_restaurant_id' => session('current_restaurant_id'),
        ]);
    }
}
