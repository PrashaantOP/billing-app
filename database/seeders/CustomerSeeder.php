<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurantId = 1; // Replace with an existing restaurant ID

        Customer::insert([
            [
                'restaurant_id' => $restaurantId,
                'name' => 'John Doe',
                'phone' => '1234567890',
                'email' => 'john@example.com',
                'address' => '123 Street, City',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'restaurant_id' => $restaurantId,
                'name' => 'Jane Smith',
                'phone' => '9876543210',
                'email' => 'jane@example.com',
                'address' => '456 Avenue, Town',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
