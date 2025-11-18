<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DiscountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('discounts')->insert([
            [
                'code' => 'GIAM10',
                'percentage' => 10.00,
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(5),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'GIAM25',
                'percentage' => 25.00,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(10),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'HETHANG',
                'percentage' => 15.00,
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->subDays(1),
                'status' => 'inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
