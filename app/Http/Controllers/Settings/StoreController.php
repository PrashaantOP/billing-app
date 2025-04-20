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
        $store = $request->user()->store;

        return Inertia::render('settings/storeEdit', [
            'store' => $store,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_email' => 'nullable|email',
            'store_phone' => 'nullable|string|max:20',
            'store_address' => 'nullable|string',
            'store_gst_no' => 'nullable|string|max:50',
        ]);

        $store = $request->user()->store;

        $store->update([
            'name' => $request->store_name,
            'email' => $request->store_email,
            'phone' => $request->store_phone,
            'address' => $request->store_address,
            'gst_no' => $request->store_gst_no,
        ]);

        return back()->with('success', 'Store updated.');
    }
}
