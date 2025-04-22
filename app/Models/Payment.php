<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'restaurant_id',
        'order_id',
        'payment_date',
        'amount_paid',
        'payment_method',
        'transaction_reference',
        'notes'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
