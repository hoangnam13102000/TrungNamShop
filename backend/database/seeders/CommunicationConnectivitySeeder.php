<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommunicationConnectivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('communication_connectivities')->insert([
            [
                'nfc' => true,
                'sim_slot' => 'Dual SIM (Nano-SIM)',
                'mobile_network' => '5G, 4G LTE',
                'gps' => 'GPS, A-GPS, GLONASS, BDS',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nfc' => false,
                'sim_slot' => 'Single SIM (Nano-SIM)',
                'mobile_network' => '4G LTE',
                'gps' => 'GPS, GLONASS',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nfc' => true,
                'sim_slot' => 'Dual SIM (eSIM + Nano-SIM)',
                'mobile_network' => '5G, 4G LTE, 3G',
                'gps' => 'GPS, A-GPS, Galileo, GLONASS',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
