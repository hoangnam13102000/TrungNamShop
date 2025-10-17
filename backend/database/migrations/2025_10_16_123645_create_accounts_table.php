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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('account_type_id');
            $table->unsignedBigInteger('account_level_id');

            $table->string('username')->unique();
            $table->integer('reward_points')->default(0);
            $table->string('password');
            $table->string('token')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('account_type_id')
                  ->references('id')
                  ->on('account_types')
                  ->onDelete('cascade');

            $table->foreign('account_level_id')
                  ->references('id')
                  ->on('account_levels')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
