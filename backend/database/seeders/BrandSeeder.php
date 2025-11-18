<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('brands')->insert([
            [
                'name' => 'Iphone',
                'image' => 'brands/iphone.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung',
                'image' => 'brands/samsung.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Xiaomi',
                'image' => 'brands/xiaomi.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Oppo',
                'image' => 'brands/oppo.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vivo',
                'image' => 'brands/vivo.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
