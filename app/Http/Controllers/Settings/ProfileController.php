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

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle image upload/removal
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if (!empty($user->image) && file_exists(public_path($user->image))) {
                @unlink(public_path($user->image));
            }

            $imageFile = $request->file('image');
            $filename = 'user_' . $user->id . '_' . time() . '.' . $imageFile->getClientOriginalExtension();
            $destinationPath = public_path('assets/images/users');
            $relativePath = $filename;

            // Create directory if it doesn't exist
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Move new image
            $imageFile->move($destinationPath, $filename);
            $validated['image'] = $relativePath;
        } elseif ($request->has('remove_image') && $request->input('remove_image')) {
            // Remove image
            if (!empty($user->image) && file_exists(public_path($user->image))) {
                @unlink(public_path($user->image));
            }
            $validated['image'] = null;
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
