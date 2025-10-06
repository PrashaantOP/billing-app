<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            // Basic Monthly Plan
            [
                'name' => 'Basic Monthly',
                'description' => 'Perfect for small restaurants and cafes. Essential features to manage your orders efficiently.',
                'monthly_price' => 999.00,
                'yearly_price' => 0.00, // Not applicable
                'features' => json_encode([
                    'max_restaurants' => 1,
                    'max_users' => 3,
                    'max_menu_items' => 50,
                    'max_orders_per_month' => 500,
                    'basic_reports',
                    'customer_management',
                    'order_management',
                    'menu_management',
                    'basic_support'
                ]),
                'max_restaurants' => 1,
                'max_users_per_restaurant' => 3,
                'max_menu_items' => 50,
                'max_orders_per_month' => 500,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Basic Yearly Plan
            [
                'name' => 'Basic Yearly',
                'description' => 'Annual subscription with 2 months free! Essential features for small restaurants with significant cost savings.',
                'monthly_price' => 0.00, // Not applicable
                'yearly_price' => 9990.00, // 10x monthly price (2 months free)
                'features' => json_encode([
                    'max_restaurants' => 1,
                    'max_users' => 3,
                    'max_menu_items' => 50,
                    'max_orders_per_month' => 500,
                    'basic_reports',
                    'customer_management',
                    'order_management',
                    'menu_management',
                    'basic_support',
                    'yearly_discount',
                    '2_months_free'
                ]),
                'max_restaurants' => 1,
                'max_users_per_restaurant' => 3,
                'max_menu_items' => 50,
                'max_orders_per_month' => 500,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('subscription_plans')->insert($plans);

        $this->command->info('2 Subscription plans seeded successfully!');
        $this->command->line('✓ Basic Monthly - ₹999/month');
        $this->command->line('✓ Basic Yearly - ₹9990/year (2 months free)');
    }
}
