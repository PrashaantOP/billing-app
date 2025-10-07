<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\RestaurantUser;
use App\Models\User;
use App\Models\Store;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $restaurant = Restaurant::create([
            'name' => 'Your Restaurant',
            'email' => $request->email,
        ]);

        $user = User::create([
            'restaurant_id' => $restaurant->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        RestaurantUser::create([
            'user_id' => $user->id,
            'restaurant_id' => $restaurant->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Set session for current restaurant
        Session::put('current_restaurant_id', $restaurant->id);
        Session::put('switched_restaurant', $restaurant);

        // --- Store Role In Session Here ---
        // $role = $restaurant->pivot->role ?? null;
        Session::put('current_role', 'admin');

        return to_route('dashboard');
    }
}
