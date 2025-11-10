<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PositionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            ['name' => 'Nhân viên cửa hàng', 'base_salary' => 12000000.00],
            ['name' => 'Quản lý cửa hàng', 'base_salary' => 15000000.00],
        ];

        DB::table('positions')->insert($positions);
    }
}
