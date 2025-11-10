<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('memories')->insert([
            [
                'ram' => '4GB',
                'internal_storage' => '64GB',
                'memory_card_slot' => 'MicroSD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ram' => '6GB',
                'internal_storage' => '128GB',
                'memory_card_slot' => 'NanoSD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ram' => '8GB',
                'internal_storage' => '256GB',
                'memory_card_slot' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ram' => '12GB',
                'internal_storage' => '512GB',
                'memory_card_slot' => 'MicroSD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ram' => '16GB',
                'internal_storage' => '1TB',
                'memory_card_slot' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
