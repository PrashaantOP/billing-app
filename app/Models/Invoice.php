<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'store_id', 'customer_id', 'user_id', 'invoice_number',
        'invoice_date', 'due_date', 'status', 'notes', 'terms',
        'subtotal', 'tax_total', 'discount_total', 'total_amount', 'amount_paid'
    ];

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(InvoiceItem::class);
    }

    public function taxes() {
        return $this->hasMany(InvoiceTax::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }
}
