<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'name', 'sku', 'barcode', 'price', 'cost_price',
        'quantity', 'unit', 'status'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function invoiceItems() {
        return $this->hasMany(InvoiceItem::class);
    }

    public function stockEntries() {
        return $this->hasMany(StockEntry::class);
    }
}
