<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'billing_cycle',
        'starts_at',
        'ends_at',
        'next_billing_date',
        'status',
        'amount',
        'auto_renew',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $dates = [
        'starts_at',
        'ends_at',
        'next_billing_date',
        'cancelled_at'
    ];

    protected $casts = [
        'auto_renew' => 'boolean',
    ];

    // Relations

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function payments()
    {
        return $this->hasMany(SubscriptionPayment::class, 'user_subscription_id');
    }
}
