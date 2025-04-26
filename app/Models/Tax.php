<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'taxes';
<<<<<<< HEAD

=======
>>>>>>> d02bc60f6c676fdc64591717397e5d2ad398ed85
    protected $fillable = ['restaurant_id', 'name', 'rate', 'is_inclusive'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
