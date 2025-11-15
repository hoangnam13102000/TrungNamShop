<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('momo_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('orderId');       // orderId của Momo
            $table->string('requestId');     // requestId của Momo
            $table->decimal('amount', 15, 2);
            $table->integer('errorCode')->nullable();
            $table->boolean('is_success')->default(false);
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('momo_payments');
    }
};
