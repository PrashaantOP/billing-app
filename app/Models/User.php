<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'image',
        'email',
        'mobile',
        'otp',
        'otp_expires_at',
        'password',
        'account_type',
        'trial_ends_at',
        'is_trial_used',
        'current_subscription_id'
    ];

    protected $hidden = ['password', 'remember_token'];

    // Pivot relation for restaurants
    public function restaurants()
    {
        return $this->belongsToMany(Restaurant::class)
            ->using(\App\Models\RestaurantUser::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }

    public function logs()
    {
        return $this->hasMany(Log::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /*** Subscription Relations ***/
    public function subscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function currentSubscription()
    {
        return $this->belongsTo(UserSubscription::class, 'current_subscription_id');
    }

    public function subscriptionPayments()
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    public function featureUsages()
    {
        return $this->hasMany(FeatureUsage::class);
    }
}
