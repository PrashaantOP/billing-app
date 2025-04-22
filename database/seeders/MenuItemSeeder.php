<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'restaurant_id' => 1,
                'category_id' => 1,
                'name' => 'Spring Rolls',
                'description' => 'Crispy rolls with veggies and sweet chili sauce',
                'price' => 5.99,
                'food_type' => 'veg',
                'is_available' => true,
            ],
            [
                'restaurant_id' => 1,
                'category_id' => 2,
                'name' => 'Grilled Chicken',
                'description' => 'Juicy grilled chicken served with garlic rice',
                'price' => 12.49,
                'food_type' => 'non veg',
                'is_available' => true,
            ],
            [
                'restaurant_id' => 1,
                'category_id' => 3,
                'name' => 'Mango Smoothie',
                'description' => 'Fresh mango blended with ice and yogurt',
                'price' => 4.50,
                'food_type' => 'veg',
                'is_available' => true,
            ],
            [
                'restaurant_id' => 1,
                'category_id' => 5,
                'name' => 'Bruschetta',
                'description' => 'Toasted bread with tomatoes and basil',
                'price' => 6.75,
                'food_type' => 'veg',
                'is_available' => true,
            ],
            [
                'restaurant_id' => 1,
                'category_id' => 8,
                'name' => 'Pancake Stack',
                'description' => 'Fluffy pancakes with maple syrup and butter',
                'price' => 7.80,
                'food_type' => 'veg',
                'is_available' => true,
            ],
        ];

        foreach ($items as &$item) {
            $item['created_at'] = now();
            $item['updated_at'] = now();
        }

        DB::table('menu_items')->insert($items);
    }
}
