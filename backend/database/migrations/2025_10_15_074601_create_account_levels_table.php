<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('account_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->decimal('limit', 15, 2)->default(0); // Hạn mức (VD: 5000000)
            $table->timestamps();
            $table->softDeletes(); 
        });
        DB::table('account_levels')->insert([
            'id' => 1,
            'name' => 'Thành viên',
            'limit' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_levels');
    }
};
