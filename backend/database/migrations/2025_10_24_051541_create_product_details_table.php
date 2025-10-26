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
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete()
                ->index();

            $table->foreignId('color_id')
                ->nullable()
                ->constrained('colors')
                ->nullOnDelete()
                ->index();

            // Technical specifications
            $table->foreignId('screen_id')->nullable()->constrained('screens')->nullOnDelete()->index();
            $table->foreignId('rear_camera_id')->nullable()->constrained('rear_cameras')->nullOnDelete()->index();
            $table->foreignId('front_camera_id')->nullable()->constrained('front_cameras')->nullOnDelete()->index();
            $table->foreignId('memory_id')->nullable()->constrained('memories')->nullOnDelete()->index();
            $table->foreignId('operating_system_id')->nullable()->constrained('operating_systems')->nullOnDelete()->index();
            $table->foreignId('general_information_id')->nullable()->constrained('general_informations')->nullOnDelete()->index();
            $table->foreignId('communication_connectivity_id')->nullable()->constrained('communication_connectivities')->nullOnDelete()->index();
            $table->foreignId('battery_charging_id')->nullable()->constrained('battery_chargings')->nullOnDelete()->index();
            $table->foreignId('utility_id')->nullable()->constrained('utilities')->nullOnDelete()->index();

            // Business info
            $table->decimal('price', 15, 2)->nullable();
            $table->unsignedInteger('stock_quantity')->default(0);

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
