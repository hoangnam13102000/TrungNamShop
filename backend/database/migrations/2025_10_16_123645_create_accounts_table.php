<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

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
         DB::table('accounts')->insert([
        'account_type_id' => 3,
        'account_level_id' => 1,
        'username' => 'admin',
        'password' => Hash::make('123456'),
        'reward_points' => 0,
        'status' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
