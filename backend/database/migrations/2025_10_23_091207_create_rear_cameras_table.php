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
        Schema::create('rear_cameras', function (Blueprint $table) {
            $table->id();
            $table->string('resolution', 100)->nullable();
            $table->string('aperture', 100)->nullable();
            $table->string('video_capability', 100)->nullable();
            $table->text('features')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rear_cameras');
    }
};
