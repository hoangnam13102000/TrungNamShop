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
        Schema::create('account_types', function (Blueprint $table) {
            $table->id();
            $table->string('account_type_name', 100);
            $table->timestamps(); 
            $table->softDeletes(); 
        });
        DB::table('account_types')->insert([
            ['id' => 1, 'account_type_name' => 'Admin', 
            'created_at' => now(), 
            'updated_at' => now()],
            ['id' => 2, 'account_type_name' => 'Nhân viên',
             'created_at' => now(), 
             'updated_at' => now()],
            ['id' => 3, 'account_type_name' => 'Khách hàng', 
            'created_at' => now(), 
            'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_types');
    }
};
