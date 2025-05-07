<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RestaurantUser extends Pivot
{
    protected $table = 'restaurant_user';

    protected $fillable = [
        'restaurant_id',
        'user_id',
        'role',
        'is_active',
    ];

    public $timestamps = true; // because your pivot table has created_at and updated_at
}
