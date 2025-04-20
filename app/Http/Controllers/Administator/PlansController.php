<?php

namespace App\Http\Controllers\Administator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlansController extends Controller
{
    public function viewPlans(){
        return Inertia::render('backend/plans/plans');
    }
}
