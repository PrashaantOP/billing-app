<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $fillable = ['store_id', 'name', 'rate', 'is_inclusive'];

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function invoiceTaxes() {
        return $this->hasMany(InvoiceTax::class);
    }
}
