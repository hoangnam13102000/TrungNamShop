<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalaryCoefficientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coefficients = [
            ['coefficient_name' => 'Nhân viên mới', 'coefficient_value' => 1.00],
            ['coefficient_name' => 'Nhân viên kinh nghiệm', 'coefficient_value' => 1.50],
            ['coefficient_name' => 'Tổ trưởng', 'coefficient_value' => 2.00],
            ['coefficient_name' => 'Quản lý cửa hàng', 'coefficient_value' => 2.50],
        ];

        DB::table('salary_coefficients')->insert($coefficients);
    }
}
