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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->unsignedBigInteger('account_id')->nullable();
            $table->unsignedBigInteger('position_id')->nullable();
            $table->unsignedBigInteger('store_id')->nullable();
            $table->unsignedBigInteger('warehouse_id')->nullable();

            // Basic info
            $table->string('full_name', 191)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->string('email', 191)->nullable();
            $table->string('address', 255)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();

            // Avatar + Status
            $table->string('avatar')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('account_id')
                ->references('id')
                ->on('accounts')
                ->onDelete('set null');

            $table->foreign('position_id')
                ->references('id')
                ->on('positions')
                ->onDelete('set null');

            $table->foreign('store_id')
                ->references('id')
                ->on('stores')
                ->onDelete('set null');

            $table->foreign('warehouse_id')
                ->references('id')
                ->on('warehouses')
                ->onDelete('set null');
    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
