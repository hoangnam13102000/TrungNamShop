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
        Schema::create('attendances', function (Blueprint $table) {
             $table->id();

           
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');

            $table->foreignId('salary_coefficient_id')->nullable()->constrained('salary_coefficients')->onDelete('set null');
            $table->foreignId('allowance_id')->nullable()->constrained('allowances')->onDelete('set null');
            $table->foreignId('reward_id')->nullable()->constrained('rewards')->onDelete('set null');

            $table->integer('month');
            $table->integer('year');
            $table->integer('work_days')->default(0);
            $table->decimal('advance_payment', 15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
