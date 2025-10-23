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
        Schema::create('operating_systems', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // Operating system name
            $table->string('processor', 100)->nullable(); // CPU / Processor
            $table->string('cpu_speed', 50)->nullable(); // CPU speed
            $table->string('gpu', 100)->nullable(); // Graphics chip
            $table->timestamps();
            $table->softDeletes(); // Soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operating_systems');
    }
};
