<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('colors')->insert([
            ['name' => 'Đen',       'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trắng',     'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xanh dương','created_at' => now(), 'updated_at' => now()],
            ['name' => 'Đỏ',        'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xám',        'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
