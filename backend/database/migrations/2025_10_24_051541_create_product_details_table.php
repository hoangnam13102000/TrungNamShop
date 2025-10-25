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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();

            // FK to PK
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('color_id')->nullable()->constrained('colors')->onDelete('set null');

            // Technical information
            $table->foreignId('screen_id')->nullable()->constrained('screens')->onDelete('set null');
            $table->foreignId('rear_camera_id')->nullable()->constrained('rear_cameras')->onDelete('set null');
            $table->foreignId('front_camera_id')->nullable()->constrained('front_cameras')->onDelete('set null');
            $table->foreignId('memory_id')->nullable()->constrained('memories')->onDelete('set null');
            $table->foreignId('operating_system_id')->nullable()->constrained('operating_systems')->onDelete('set null');
            $table->foreignId('general_information_id')->nullable()->constrained('general_informations')->onDelete('set null');
            $table->foreignId('communication_connectivity_id')->nullable()->constrained('communication_connectivities')->onDelete('set null');
            $table->foreignId('battery_charging_id')->nullable()->constrained('batteries_charging')->onDelete('set null');
            $table->foreignId('utility_id')->nullable()->constrained('utilities')->onDelete('set null');

            //bussiness Info
            $table->decimal('price', 15, 2)->nullable();
            $table->integer('stock_quantity')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
