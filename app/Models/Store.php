<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table = 'stores';
    protected $fillable = ['name', 'email', 'phone', 'address', 'gst_no'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function customers() {
        return $this->hasMany(Customer::class);
    }

    public function categories() {
        return $this->hasMany(Category::class);
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }

    public function stockEntries() {
        return $this->hasMany(StockEntry::class);
    }

    public function logs() {
        return $this->hasMany(Log::class);
    }

    public function recurringInvoices() {
        return $this->hasMany(RecurringInvoice::class);
    }

    public function taxes() {
        return $this->hasMany(Tax::class);
    }
}
