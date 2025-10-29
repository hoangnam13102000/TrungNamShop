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

            // Technical specifications with custom FK names
            $table->foreignId('screen_id')->nullable()->index();
            $table->foreign('screen_id', 'product_details_screen_id_fk')
                ->references('id')->on('screens')
                ->nullOnDelete();

            $table->foreignId('rear_camera_id')->nullable()->index();
            $table->foreign('rear_camera_id', 'product_details_rear_camera_id_fk')
                ->references('id')->on('rear_cameras')
                ->nullOnDelete();

            $table->foreignId('front_camera_id')->nullable()->index();
            $table->foreign('front_camera_id', 'product_details_front_camera_id_fk')
                ->references('id')->on('front_cameras')
                ->nullOnDelete();

            $table->foreignId('memory_id')->nullable()->index();
            $table->foreign('memory_id', 'product_details_memory_id_fk')
                ->references('id')->on('memories')
                ->nullOnDelete();

            $table->foreignId('operating_system_id')->nullable()->index();
            $table->foreign('operating_system_id', 'product_details_os_id_fk')
                ->references('id')->on('operating_systems')
                ->nullOnDelete();

            $table->foreignId('general_information_id')->nullable()->index();
            $table->foreign('general_information_id', 'product_details_general_info_id_fk')
                ->references('id')->on('general_informations')
                ->nullOnDelete();

            $table->foreignId('communication_connectivity_id')->nullable()->index();
            $table->foreign('communication_connectivity_id', 'product_details_comm_id_fk')
                ->references('id')->on('communication_connectivities')
                ->nullOnDelete();

            $table->foreignId('battery_charging_id')->nullable()
                ->constrained('batteries_charging')
                ->nullOnDelete();

            $table->foreignId('utility_id')->nullable()->index();
            $table->foreign('utility_id', 'product_details_utility_id_fk')
                ->references('id')->on('utilities')
                ->nullOnDelete();

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
