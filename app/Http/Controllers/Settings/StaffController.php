<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $restaurantId = session('current_restaurant_id');

        // Join with restaurant_user for roles & filter staff for current restaurant
        $staffs = \DB::table('restaurant_user')
            ->join('users', 'restaurant_user.user_id', '=', 'users.id')
            ->where('restaurant_user.restaurant_id', $restaurantId)
            ->where('restaurant_user.role', 'staff')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.mobile',
                'users.image',
                'restaurant_user.role',
                'restaurant_user.is_active',
                'restaurant_user.created_at as assigned_at'
            )
            ->orderByDesc('restaurant_user.created_at')
            ->get();

        return inertia('settings/staff/StaffList', [
            'staffs' => $staffs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'nullable|email|email',
            'mobile' => 'nullable',
            'password' => 'required|min:6'
        ]);

        // Step 1: Find existing user (by email OR mobile), else create new
        $user = null;

        if ($request->filled('email')) {
            $user = \App\Models\User::where('email', $request->email)->first();
        }
        // Mobile based user finding, if you want
        if (!$user && $request->filled('mobile')) {
            $user = \App\Models\User::where('mobile', $request->mobile)->first();
        }

        // Step 2: If user doesn't exist, create
        if (!$user) {
            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            ]);
        }

        $restaurantId = session('current_restaurant_id');

        // Step 3: Check if restaurant_user entry ALREADY exists for this user+restaurant
        $exists = \DB::table('restaurant_user')
            ->where('user_id', $user->id)
            ->where('restaurant_id', $restaurantId)
            ->exists();

        if (!$exists) {
            // Insert only if not exists
            \DB::table('restaurant_user')->insert([
                'user_id' => $user->id,
                'restaurant_id' => $restaurantId,
                'role' => 'staff',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return redirect()->back()->with('success', 'Staff linked to restaurant!');
        } else {
            return redirect()->back()->with('info', 'This user is already assigned to this restaurant.');
        }
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'mobile' => 'nullable',
        ]);
        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email', 'mobile']));
        return redirect()->back()->with('success', 'Staff updated!');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        \DB::table('restaurant_user')->where('user_id', $id)->delete();
        return redirect()->back()->with('success', 'Staff deleted!');
    }
}
