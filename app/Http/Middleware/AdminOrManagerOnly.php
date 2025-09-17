<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOrManagerOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // You might store role in session as 'current_role'
        if (session('current_role') === 'staff') {
            // You can redirect, abort 403, or redirect to dashboard
            return abort(403, 'Unauthorized action.');
        }
        return $next($request);
    }
}
