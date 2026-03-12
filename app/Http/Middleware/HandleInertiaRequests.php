<?php

namespace App\Http\Middleware;

use App\Models\Restaurant;
use App\Models\RestaurantPrintSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Session;

class HandleInertiaRequests extends Middleware
{
    private function resolvePrintSettings(): array
    {
        $restaurantId = session('current_restaurant_id');
        if (!$restaurantId) {
            return [
                'print_type'         => 'bill_only',
                'paper_size'         => '80mm',
                'header_text'        => '',
                'footer_text'        => 'Thank you for visiting!',
                'show_logo'          => true,
                'show_tax_details'   => true,
                'show_customer_info' => true,
                'show_order_type'    => true,
                'font_size'          => 'medium',
            ];
        }

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

        return $settings->toArray();
    }

    private function resolveCurrentRestaurant(): ?array
    {
        $restaurantId = session('current_restaurant_id');
        if (!$restaurantId) return null;
        $r = Restaurant::find($restaurantId);
        return $r ? $r->only(['id', 'name', 'logo', 'email', 'phone', 'address', 'gst_no']) : null;
    }

    private function resolveSubscription(Request $request): array
    {
        $user = $request->user();
        if (!$user) {
            return ['plan_name' => 'Free Plan', 'status' => 'free', 'is_pro' => false];
        }

        $sub = $user->currentSubscription?->load('plan');

        if ($sub && $sub->plan && in_array($sub->status, ['active', 'trialing'])) {
            return [
                'plan_name' => $sub->plan->name,
                'status'    => $sub->status,
                'is_pro'    => true,
            ];
        }

        return ['plan_name' => 'Free Plan', 'status' => 'free', 'is_pro' => false];
    }


    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'restaurants' => $request->user()?->restaurants()->select('restaurants.id', 'restaurants.name', 'restaurants.address', 'restaurants.logo')->get() ?? [],
                'current_restaurant_id' => Session::get('current_restaurant_id'),
            ],
            'current_role' => fn() => Session::get('current_role'),
            'subscription'      => fn() => $this->resolveSubscription($request),
            'printSettings'     => fn() => $this->resolvePrintSettings(),
            'currentRestaurant' => fn() => $this->resolveCurrentRestaurant(),
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // ✅ Add this block for flash data
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'customer' => fn() => $request->session()->get('customer'), // ← important
            ],
        ];
    }
}
