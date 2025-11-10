<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScreenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('screens')->insert([
            [
                'display_technology' => 'AMOLED',
                'resolution' => '2400 x 1080',
                'screen_size' => '6.5 inch',
                'max_brightness' => '1200 nits',
                'glass_protection' => 'Gorilla Glass Victus',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'display_technology' => 'Super Retina XDR OLED',
                'resolution' => '2532 x 1170',
                'screen_size' => '6.1 inch',
                'max_brightness' => '1200 nits',
                'glass_protection' => 'Ceramic Shield',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'display_technology' => 'IPS LCD',
                'resolution' => '2400 x 1080',
                'screen_size' => '6.6 inch',
                'max_brightness' => '500 nits',
                'glass_protection' => 'Gorilla Glass 5',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'display_technology' => 'AMOLED',
                'resolution' => '3200 x 1440',
                'screen_size' => '6.8 inch',
                'max_brightness' => '1500 nits',
                'glass_protection' => 'Gorilla Glass Victus+',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
