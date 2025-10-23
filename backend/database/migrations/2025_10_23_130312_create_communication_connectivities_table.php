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
        Schema::create('communication_connectivities', function (Blueprint $table) {
             $table->id();
            $table->boolean('nfc')->default(false);
            $table->string('sim_slot', 100)->nullable();
            $table->string('mobile_network', 50)->nullable();
            $table->string('gps', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communication_connectivities');
    }
};
