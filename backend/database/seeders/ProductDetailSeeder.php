<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductDetail;

class ProductDetailSeeder extends Seeder
{
    public function run(): void
    {
        ProductDetail::where('product_id', 1)->update([
            'screen_id' => 1,
            'rear_camera_id' => 1,
            'front_camera_id' => 1,
            'memory_id' => 1,
            'operating_system_id' => 1,
            'general_information_id' => 1,
            'communication_connectivity_id' => 1,
            'battery_charging_id' => 1,
            'utility_id' => 1,
            'price' => 12000000,
            'stock_quantity' => 50,
        ]);

        
        ProductDetail::where('product_id', 2)->update([
            'screen_id' => 2,
            'rear_camera_id' => 2,
            'front_camera_id' => 2,
            'memory_id' => 2,
            'operating_system_id' => 2,
            'general_information_id' => 2,
            'communication_connectivity_id' => 2,
            'battery_charging_id' => 2,
            'utility_id' => 2,
            'price' => 15000000,
            'stock_quantity' => 30,
        ]);

         ProductDetail::where('product_id', 3)->update([
            'screen_id' => 3,
            'rear_camera_id' => 3,
            'front_camera_id' => 2,
            'memory_id' => 1,
            'operating_system_id' => 2,
            'general_information_id' => 3,
            'communication_connectivity_id' => 2,
            'battery_charging_id' => 3,
            'utility_id' => 3,
            'price' => 17000000,
            'stock_quantity' => 30,
        ]);
    }
}
