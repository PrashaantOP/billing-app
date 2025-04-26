<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'taxes';

    protected $fillable = ['restaurant_id', 'name', 'rate', 'is_inclusive'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
