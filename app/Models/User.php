<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'image',
        'email',
        'mobile',
        'otp',
        'otp_expires_at',
        'password'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function restaurants()
    {
        return $this->belongsToMany(Restaurant::class)
            ->using(\App\Models\RestaurantUser::class) // tell Laravel to use this model for the pivot
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
}
