<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeneralInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('general_informations')->insert([
            [
                'design' => 'Nguyên khối',
                'material' => 'Khung nhôm & mặt lưng kính',
                'dimensions' => '146.7 x 71.5 x 7.8 mm',
                'weight' => '172 g',
                'launch_time' => '2023-09-15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'design' => 'Bo cong viền',
                'material' => 'Khung nhựa & mặt lưng kính cường lực',
                'dimensions' => '160.8 x 78.1 x 7.8 mm',
                'weight' => '202 g',
                'launch_time' => '2024-03-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'design' => 'Vuông cạnh',
                'material' => 'Khung titan & kính gốm',
                'dimensions' => '158.0 x 77.6 x 8.3 mm',
                'weight' => '198 g',
                'launch_time' => '2024-09-20',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
