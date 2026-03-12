<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Expand enum to include both old and new values
        DB::statement("ALTER TABLE restaurant_print_settings
            MODIFY COLUMN print_type ENUM('kot','a4','bill_only','kot_bill') NOT NULL DEFAULT 'bill_only'");

        // Step 2: Migrate old values to new ones
        DB::table('restaurant_print_settings')->update(['print_type' => 'bill_only']);

        // Step 3: Lock enum to new values only
        DB::statement("ALTER TABLE restaurant_print_settings
            MODIFY COLUMN print_type ENUM('bill_only','kot_bill') NOT NULL DEFAULT 'bill_only'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE restaurant_print_settings
            MODIFY COLUMN print_type ENUM('kot','a4') NOT NULL DEFAULT 'kot'");
    }
};
