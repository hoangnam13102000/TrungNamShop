<?php

namespace Database\Seeders;

use App\Models\Screen;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(PositionsTableSeeder::class);
        $this->call(ScreenSeeder::class);
        $this->call(RearCameraSeeder::class);
        $this->call(ColorSeeder::class);
        $this->call(FrontCameraSeeder::class);
        $this->call(GeneralInformationSeeder::class);
        $this->call(SalaryCoefficientsTableSeeder::class);
        $this->call(OperatingSystemSeeder::class);
        $this->call(BatteryChargingSeeder::class);
        $this->call(CommunicationConnectivitySeeder::class);
        $this->call(MemorySeeder::class);
        $this->call(UtilitySeeder::class);
        $this->call(AllowancesTableSeeder::class);
        $this->call(RewardsTableSeeder::class);




        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

         $this->call(StoreSeeder::class);
    }
}
