<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Margherita Pizza', 'description' => 'Classic cheese pizza', 'unit' => 'plate'],
            ['name' => 'Veg Burger', 'description' => 'Crispy veggie burger with fries', 'unit' => 'piece'],
            ['name' => 'Chicken Biryani', 'description' => 'Spicy chicken biryani with raita', 'unit' => 'plate'],
            ['name' => 'Cold Coffee', 'description' => 'Chilled coffee with ice cream', 'unit' => 'glass'],
            ['name' => 'Pasta Alfredo', 'description' => 'Creamy white sauce pasta', 'unit' => 'bowl'],
        ];

        foreach ($products as $product) {
            Product::create([
                'store_id' => 1, // Ensure store with ID 1 exists
                'name' => $product['name'],
                'description' => $product['description'],
                'unit' => $product['unit'],
                'slug' => Str::slug($product['name']),
            ]);
        }
    }
}
