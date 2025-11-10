<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RewardsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rewards = [
            ['reward_name' => 'Thưởng doanh số bán hàng', 'reward_money' => 2000000],
            ['reward_name' => 'Thưởng nhân viên xuất sắc', 'reward_money' => 1500000],
            ['reward_name' => 'Thưởng bán sản phẩm mới', 'reward_money' => 1000000],
            ['reward_name' => 'Thưởng cuối tháng', 'reward_money' => 1200000],
            ['reward_name' => 'Thưởng chiến dịch marketing', 'reward_money' => 800000],
        ];

        DB::table('rewards')->insert($rewards);
    }
}
