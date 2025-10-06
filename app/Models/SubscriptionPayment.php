<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPayment extends Model
{
    protected $fillable = [
        'user_subscription_id',
        'user_id',
        'payment_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'payment_response',
        'billing_date',
    ];

    protected $casts = [
        'payment_response' => 'array',
        'billing_date' => 'date'
    ];

    // Relations

    public function subscription()
    {
        return $this->belongsTo(UserSubscription::class, 'user_subscription_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
