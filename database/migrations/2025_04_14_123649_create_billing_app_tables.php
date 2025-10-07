<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Password reset
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Restaurants
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('gst_no')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('suspended_at')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->timestamps();
        });




        // Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('mobile')->nullable()->unique();
            $table->string('otp')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->unsignedBigInteger('current_subscription_id')->nullable();
            $table->enum('account_type', ['free', 'premium'])->default('free');
            $table->timestamp('trial_ends_at')->nullable();
            $table->boolean('is_trial_used')->default(false);
            $table->timestamps();
        });


        //subscriptions structure

        // 1. Subscription Plans
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('monthly_price', 10, 2);
            $table->decimal('yearly_price', 10, 2);
            $table->json('features');
            $table->integer('max_restaurants')->nullable();
            $table->integer('max_users_per_restaurant')->nullable();
            $table->integer('max_menu_items')->nullable();
            $table->integer('max_orders_per_month')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. User Subscriptions
        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_plan_id')->constrained();
            $table->enum('billing_cycle', ['monthly', 'yearly']);
            $table->date('starts_at');
            $table->date('ends_at');
            $table->date('next_billing_date')->nullable();
            $table->enum('status', ['active', 'cancelled', 'expired', 'suspended'])->default('active');
            $table->decimal('amount', 10, 2);
            $table->boolean('auto_renew')->default(true);
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });

        // 3. Subscription Payments
        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('payment_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded']);
            $table->string('payment_method')->nullable();
            $table->json('payment_response')->nullable();
            $table->date('billing_date');
            $table->timestamps();
        });

        // 4. Feature Usage Tracking
        Schema::create('feature_usage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('restaurant_id')->constrained();
            $table->string('feature');
            $table->integer('usage_count')->default(0);
            $table->date('usage_date');
            $table->timestamps();

            $table->index(['user_id', 'restaurant_id', 'feature', 'usage_date']);
        });

        // subscriptions structure end

        // Tables (seating)
        Schema::create('dining_tables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->string('name'); // e.g., Table 1, VIP 2
            $table->integer('capacity')->nullable();
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });

        // Customers
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });

        // Categories (Menu sections)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->string('name');
            $table->string('slug');
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });

        // Menu Items
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('name');
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('food_type', ['veg', 'non veg'])->default('non veg');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
            $table->foreign('category_id')->references('id')->on('categories');
        });

        // Orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('dining_table_id')->nullable();
            $table->string('order_number')->unique();
            $table->enum('order_type', ['dinein', 'takeaway', 'delivery']);
            $table->enum('status', ['pending', 'preparing', 'served', 'completed', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->enum('discount_type', ['percent', 'fixed'])->nullable();
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->decimal('discount', 10, 2)->default(0); // final calculated discount
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->decimal('due_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['pending', 'paid', 'partial'])->default('pending');
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('dining_table_id')->references('id')->on('dining_tables');
        });

        // Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('menu_item_id');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('menu_item_id')->references('id')->on('menu_items');
        });

        // Taxes
        Schema::create('taxes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->string('name');
            $table->decimal('rate', 5, 2);
            $table->enum('rate_type', ['percent', 'amount'])->default('percent');
            $table->boolean('is_inclusive')->default(false);
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
        });

        // Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->unsignedBigInteger('order_id');
            $table->date('payment_date');
            $table->decimal('amount_paid', 10, 2);
            $table->enum('payment_method', ['cash', 'bank', 'upi', 'card', 'cheque'])->default('cash');
            $table->string('transaction_reference')->nullable();
            $table->enum('status', ['paid', 'partial']);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
            $table->foreign('order_id')->references('id')->on('orders');
        });

        // Logs
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->unsignedBigInteger('user_id');
            $table->string('action');
            $table->string('related_table');
            $table->unsignedBigInteger('related_id');
            $table->ipAddress('ip_address');
            $table->timestamps();

            $table->foreign('restaurant_id')->references('id')->on('restaurants');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('taxes');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('dining_tables');
        Schema::dropIfExists('users');
        Schema::dropIfExists('feature_usage');
        Schema::dropIfExists('subscription_payments');
        Schema::dropIfExists('user_subscriptions');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('restaurants');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
