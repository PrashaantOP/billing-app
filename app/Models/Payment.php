<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'store_id', 'invoice_id', 'payment_date',
        'amount_paid', 'payment_method', 'transaction_reference', 'notes'
    ];

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
}
