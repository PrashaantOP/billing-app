<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';
    protected $fillable = ['store_id', 'name', 'email', 'address'];

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function recurringInvoices() {
        return $this->hasMany(RecurringInvoice::class);
    }
}
