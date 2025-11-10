<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowancesTableSeeder extends Seeder
{
    public function run(): void
    {
        $allowances = [
            ['allowance_name' => 'Trợ cấp đi lại', 'allowance_amount' => 1000000],
            ['allowance_name' => 'Trợ cấp ăn trưa', 'allowance_amount' => 500000],
            ['allowance_name' => 'Phụ cấp làm thêm giờ', 'allowance_amount' => 800000],
            ['allowance_name' => 'Thưởng doanh số bán hàng', 'allowance_amount' => 1500000],
            ['allowance_name' => 'Thưởng cuối tuần', 'allowance_amount' => 400000],
        ];

        DB::table('allowances')->insert($allowances);
    }
}
