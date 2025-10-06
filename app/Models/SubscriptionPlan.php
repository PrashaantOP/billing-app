<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'monthly_price',
        'yearly_price',
        'features',
        'max_restaurants',
        'max_users_per_restaurant',
        'max_menu_items',
        'max_orders_per_month',
        'is_active'
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean'
    ];

    // Relations

    public function userSubscriptions()
    {
        return $this->hasMany(UserSubscription::class, 'subscription_plan_id');
    }
}
