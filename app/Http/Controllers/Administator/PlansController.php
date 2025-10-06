<?php

namespace App\Http\Controllers\Administator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use Inertia\Inertia;

class PlansController extends Controller
{
    public function viewPlans()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('monthly_price', 'asc')
            ->get();

        return Inertia::render('backend/plans/plans', [
            'plans' => $plans
        ]);
    }
}
