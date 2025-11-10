<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatteryChargingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('batteries_charging')->insert([
            [
                'battery_capacity' => '5000 mAh',
                'charging_port' => 'USB Type-C',
                'charging' => 'Sạc nhanh 67W, sạc không dây 30W, sạc ngược 10W',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'battery_capacity' => '4500 mAh',
                'charging_port' => 'USB Type-C',
                'charging' => 'Sạc nhanh 25W, sạc không dây 15W',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'battery_capacity' => '4820 mAh',
                'charging_port' => 'USB Type-C',
                'charging' => 'Sạc nhanh 120W, sạc không dây 50W, sạc ngược 10W',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'battery_capacity' => '4383 mAh',
                'charging_port' => 'Lightning',
                'charging' => 'Sạc nhanh 20W, sạc không dây MagSafe 15W',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
