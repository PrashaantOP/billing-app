<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockEntry extends Model
{
    protected $fillable = ['store_id', 'product_variant_id', 'quantity', 'entry_type', 'description'];

    public function store() {
        return $this->belongsTo(Store::class);
    }

    public function productVariant() {
        return $this->belongsTo(ProductVariant::class);
    }
}
