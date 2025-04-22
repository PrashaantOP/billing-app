<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['restaurant_id' => 1, 'name' => 'Appetizers'],
            ['restaurant_id' => 1, 'name' => 'Main Course'],
            ['restaurant_id' => 1, 'name' => 'Beverages'],
            ['restaurant_id' => 1, 'name' => 'Desserts'],
            ['restaurant_id' => 1, 'name' => 'Starters'],
            ['restaurant_id' => 1, 'name' => 'Lunch Specials'],
            ['restaurant_id' => 1, 'name' => 'Healthy Options'],
            ['restaurant_id' => 1, 'name' => 'Breakfast'],
            ['restaurant_id' => 1, 'name' => 'Dinner'],
            ['restaurant_id' => 1, 'name' => 'Kids Menu'],
        ];

        foreach ($categories as &$category) {
            $category['slug'] = Str::slug($category['name']);
            $category['created_at'] = now();
            $category['updated_at'] = now();
        }

        DB::table('categories')->insert($categories);
    }
}
