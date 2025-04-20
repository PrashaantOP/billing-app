<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceTax extends Model
{
    protected $table = 'invoice_tax';

    protected $fillable = ['invoice_id', 'tax_id', 'amount'];

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }

    public function tax() {
        return $this->belongsTo(Tax::class);
    }
}
