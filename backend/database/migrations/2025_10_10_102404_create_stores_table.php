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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name',30); 
            $table->string('address',500); 
            $table->string('google_map',500)->nullable();
            $table->string('phone',20);
            $table->string('email',500)->unique();
            $table->timestamps();
        });
        DB::table('stores')->insert([
            'id'=>1,
            'name'=> 'Cửa hàng 65',
            'address'=> 'Đường số 7, Hiệp Bình Phước, Q.Thủ Đức, TP.HCM',
            'email'=>'support@TechPhone.com',
            'phone'=>'1800810632',
            'google_map'=>'https://maps.app.goo.gl/eW977Vfkqsn65Mnt9',
            'created_at' => now(), 
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
