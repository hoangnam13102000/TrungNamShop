<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UtilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('utilities')->insert([
            [
                'advanced_security' => 'Nhận diện khuôn mặt, vân tay dưới màn hình',
                'special_features' => 'Mở khoá bằng khuôn mặt AI, chụp màn hình thông minh',
                'water_dust_resistance' => 'IP68 (chống nước ở độ sâu 1.5m trong 30 phút)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'advanced_security' => 'Cảm biến vân tay cạnh viền',
                'special_features' => 'Game Mode, chế độ bảo mật trẻ em',
                'water_dust_resistance' => 'IP67 (chống nước ở độ sâu 1m trong 30 phút)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'advanced_security' => 'Mở khoá khuôn mặt 3D, cảm biến vân tay siêu âm',
                'special_features' => 'Samsung DeX, Always On Display',
                'water_dust_resistance' => 'IP68',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
