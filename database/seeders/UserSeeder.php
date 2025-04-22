<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'restaurant_id' => 1, // Make sure this store exists
            'name' => 'Prashant Kumar',
            'email' => 'pk1093524@gmail.com',
            'image' => '1683556099907.jpeg',
            'mobile' => '6204709038',
            'password' => Hash::make('sachin@12345'), // Use secure password in production
            'role' => 'admin',
            'email_verified_at' => now(),
            'otp' => null,
            'otp_expires_at' => null,
            'remember_token' => Str::random(10),
        ]);
    }
}
