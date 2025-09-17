<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiningTable extends Model
{
    protected $fillable = ['restaurant_id', 'name', 'capacity'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function currentDineinOrder()
    {
        // Only 'pending' or 'preparing' dine-in orders (consider these as reserved)
        return $this->hasOne(\App\Models\Order::class, 'dining_table_id')
            ->whereIn('status', ['pending', 'preparing'])
            ->where('order_type', 'dinein');
    }
}
