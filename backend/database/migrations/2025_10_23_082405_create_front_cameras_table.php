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
        Schema::create('front_cameras', function (Blueprint $table) {
            $table->id();
            $table->string('resolution')->nullable();    
            $table->string('features')->nullable();     
            $table->string('aperture')->nullable();     
            $table->string('video_capability')->nullable(); 
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('front_cameras');
    }
};
