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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id(); // discount_id
            $table->string('code', 50)->unique(); 
            $table->decimal('percentage', 5, 2)->nullable(); 
            $table->dateTime('start_date')->nullable(); 
            $table->dateTime('end_date')->nullable(); 
            $table->enum('status', ['active', 'inactive'])->default('active'); // trạng thái
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
