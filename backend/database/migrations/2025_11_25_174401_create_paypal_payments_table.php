<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paypal_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); 
            $table->string('payment_id');   
            $table->string('payer_id')->nullable(); 
            $table->decimal('amount', 15, 2);       
            $table->boolean('is_success')->default(false);
            $table->string('status')->nullable();       
            $table->text('error_message')->nullable();  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paypal_payments');
    }
};
