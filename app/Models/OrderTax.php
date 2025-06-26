<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTax extends Model
{
    protected $fillable = [
        'restaurant_id',
        'order_id',
        'tax_id',
        'rate',
        'rate_type',
        'amount',
    ];

    /**
     * Get the order that owns this tax.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the tax definition for this order tax.
     */
    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
