<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperatingSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('operating_systems')->insert([
            [
                'name' => 'Android 14',
                'processor' => 'Qualcomm Snapdragon 8 Gen 3',
                'cpu_speed' => 'Octa-core (3.3 GHz + 2.9 GHz + 2.3 GHz)',
                'gpu' => 'Adreno 750',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'iOS 18',
                'processor' => 'Apple A17 Pro',
                'cpu_speed' => 'Hexa-core (2x3.78 GHz + 4x2.11 GHz)',
                'gpu' => 'Apple 6-core GPU',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Android 13 (MIUI 14)',
                'processor' => 'MediaTek Dimensity 9200+',
                'cpu_speed' => 'Octa-core (3.35 GHz + 3.0 GHz + 2.0 GHz)',
                'gpu' => 'ARM Immortalis-G715',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'HarmonyOS 4',
                'processor' => 'Kirin 9000S',
                'cpu_speed' => 'Octa-core (2.62 GHz + 2.15 GHz + 1.53 GHz)',
                'gpu' => 'Maleoon 910 GPU',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
