<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'restaurant_id',
        'customer_id',
        'user_id',
        'dining_table_id',
        'order_number',
        'order_type',
        'status',
        'subtotal',
        'tax',
        'discount',
        'total',
        'payment_status'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function diningTable()
    {
        return $this->belongsTo(DiningTable::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function taxes()
    {
        return $this->hasMany(OrderTax::class);
    }
}
