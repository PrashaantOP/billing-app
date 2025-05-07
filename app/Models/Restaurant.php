<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'address', 'gst_no'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(\App\Models\RestaurantUser::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }

    public function diningTables()
    {
        return $this->hasMany(DiningTable::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function taxes()
    {
        return $this->hasMany(Tax::class);
    }

    public function logs()
    {
        return $this->hasMany(Log::class);
    }
}
