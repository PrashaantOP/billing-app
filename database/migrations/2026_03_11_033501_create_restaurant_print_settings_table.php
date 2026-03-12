<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurant_print_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->enum('print_type', ['kot', 'a4'])->default('kot');
            $table->enum('paper_size', ['58mm', '80mm', 'A4', 'A5'])->default('80mm');
            $table->string('header_text', 500)->nullable();
            $table->string('footer_text', 500)->nullable();
            $table->boolean('show_logo')->default(true);
            $table->boolean('show_tax_details')->default(true);
            $table->boolean('show_customer_info')->default(true);
            $table->boolean('show_order_type')->default(true);
            $table->enum('font_size', ['small', 'medium', 'large'])->default('medium');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_print_settings');
    }
};
