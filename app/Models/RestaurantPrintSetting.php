<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantPrintSetting extends Model
{
    protected $fillable = [
        'restaurant_id',
        'print_type',
        'paper_size',
        'header_text',
        'footer_text',
        'show_logo',
        'show_tax_details',
        'show_customer_info',
        'show_order_type',
        'font_size',
    ];

    protected $casts = [
        'show_logo'          => 'boolean',
        'show_tax_details'   => 'boolean',
        'show_customer_info' => 'boolean',
        'show_order_type'    => 'boolean',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
