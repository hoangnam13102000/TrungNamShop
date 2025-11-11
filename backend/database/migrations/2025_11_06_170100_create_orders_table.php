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
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // order_id
            $table->string('order_code', 50)->unique(); 

            // Foreign keys
            $table->unsignedBigInteger('customer_id'); 
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('discount_id')->nullable(); 
            $table->unsignedBigInteger('store_id')->nullable(); 

            // Recipient info
            $table->string('recipient_name', 191);
            $table->string('recipient_address', 255);
            $table->string('recipient_phone', 20);

            // Other info
            $table->text('note')->nullable();
            $table->enum('delivery_method', ['pickup', 'delivery'])->default('delivery'); // phương thức nhận hàng
            $table->enum('payment_method', ['cash', 'paypal', 'bank_transfer', 'momo'])->default('cash'); // phương thức thanh toán

            // Dates
            $table->dateTime('delivery_date')->nullable(); 
            $table->dateTime('order_date')->useCurrent(); 

            // Status
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');
            $table->enum('order_status', ['pending', 'processing', 'shipping', 'completed', 'cancelled'])
                ->default('pending');

            // Timestamps & Soft delete
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->foreign('employee_id')->references('id')->on('employees')->nullOnDelete();
            $table->foreign('discount_id')->references('id')->on('discounts')->nullOnDelete();
            $table->foreign('store_id')->references('id')->on('stores')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
