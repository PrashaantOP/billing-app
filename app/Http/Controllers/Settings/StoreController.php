<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function edit(Request $request): Response
    {
        $store = session('switched_restaurant');

        return Inertia::render('settings/storeEdit', [
            'store' => $store,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'store_name'    => 'required|string|max:255',
            'store_email'   => 'nullable|email',
            'store_phone'   => 'nullable|string|max:20',
            'store_address' => 'nullable|string',
            'store_gst_no'  => 'nullable|string|max:50',
            'logo'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:512', // max 500KB
        ]);

        $restaurant = session('switched_restaurant');
        $updateData = [
            'name'     => $request->store_name,
            'email'    => $request->store_email,
            'phone'    => $request->store_phone,
            'address'  => $request->store_address,
            'gst_no'   => $request->store_gst_no,
        ];

        // Custom Logo Handling
        if ($request->hasFile('logo')) {
            $logoFile = $request->file('logo');
            $filename = 'logo_' . uniqid() . '.' . $logoFile->getClientOriginalExtension();
            $destinationPath = public_path('assets/images/logos');
            $relativePath = $filename;

            // Delete previous logo if exists and not default
            if (!empty($restaurant->logo) && file_exists(public_path($restaurant->logo))) {
                @unlink(public_path($restaurant->logo));
            }

            // Move new logo
            $logoFile->move($destinationPath, $filename);

            $updateData['logo'] = $relativePath;
        }

        if ($request->has('remove_logo') && $request->input('remove_logo')) {
            // Remove file from server
            if (!empty($restaurant->logo) && file_exists(public_path($restaurant->logo))) {
                @unlink(public_path($restaurant->logo));
            }
            $updateData['logo'] = null; // Remove logo path from DB
        }


        $restaurant->update($updateData);

        return back()->with('success', 'Restaurant updated.');
    }
}
