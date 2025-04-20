<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItemDiscount extends Model
{
    protected $table = 'invoice_item_discount';

    protected $fillable = ['invoice_item_id', 'discount_type', 'discount_value'];

    public function invoiceItem() {
        return $this->belongsTo(InvoiceItem::class);
    }
}
