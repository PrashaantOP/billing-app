<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            StoreSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            MenuItemSeeder::class,
        ]);

        $this->call([
            TaxSeeder::class,
        ]);

        $this->call([
            CustomerSeeder::class,
            RestaurantUserSeeder::class,
        ]);
        $this->call(DiningTableSeeder::class);
    }
}
