<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'taxes';

    protected $fillable = ['restaurant_id', 'name', 'rate', 'rate_type', 'is_inclusive'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function orderTaxes()
    {
        return $this->hasMany(OrderTax::class);
    }
}
