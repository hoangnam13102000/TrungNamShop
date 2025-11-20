<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductDetail;

class ProductDetailSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // =========================
            //      APPLE (1 → 6)
            // =========================
            1 => ['screen_id'=>1,'rear_camera_id'=>1,'front_camera_id'=>1,'memory_id'=>1,'operating_system_id'=>1,'general_information_id'=>1,'communication_connectivity_id'=>1,'battery_charging_id'=>1,'utility_id'=>1,'price'=>28990000,'promotion_id'=>1,'stock_quantity'=>100],
            2 => ['screen_id'=>2,'rear_camera_id'=>2,'front_camera_id'=>2,'memory_id'=>2,'operating_system_id'=>2,'general_information_id'=>2,'communication_connectivity_id'=>2,'battery_charging_id'=>2,'utility_id'=>2,'price'=>20990000,'promotion_id'=>null,'stock_quantity'=>70],
            3 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>3,'operating_system_id'=>3,'general_information_id'=>3,'communication_connectivity_id'=>3,'battery_charging_id'=>3,'utility_id'=>3,'price'=>5990000,'promotion_id'=>2,'stock_quantity'=>200],
            4 => ['screen_id'=>1,'rear_camera_id'=>1,'front_camera_id'=>1,'memory_id'=>2,'operating_system_id'=>1,'general_information_id'=>1,'communication_connectivity_id'=>1,'battery_charging_id'=>1,'utility_id'=>1,'price'=>23990000,'promotion_id'=>2,'stock_quantity'=>80],
            5 => ['screen_id'=>1,'rear_camera_id'=>1,'front_camera_id'=>1,'memory_id'=>2,'operating_system_id'=>1,'general_information_id'=>1,'communication_connectivity_id'=>1,'battery_charging_id'=>1,'utility_id'=>1,'price'=>26990000,'promotion_id'=>null,'stock_quantity'=>60],
            6 => ['screen_id'=>1,'rear_camera_id'=>1,'front_camera_id'=>1,'memory_id'=>3,'operating_system_id'=>1,'general_information_id'=>1,'communication_connectivity_id'=>1,'battery_charging_id'=>1,'utility_id'=>1,'price'=>31990000,'promotion_id'=>3,'stock_quantity'=>50],

            // =========================
            //      SAMSUNG (7 → 12)
            // =========================
            7 => ['screen_id'=>2,'rear_camera_id'=>2,'front_camera_id'=>2,'memory_id'=>2,'operating_system_id'=>2,'general_information_id'=>2,'communication_connectivity_id'=>2,'battery_charging_id'=>2,'utility_id'=>2,'price'=>20990000,'promotion_id'=>3,'stock_quantity'=>90],
            8 => ['screen_id'=>2,'rear_camera_id'=>3,'front_camera_id'=>2,'memory_id'=>3,'operating_system_id'=>2,'general_information_id'=>2,'communication_connectivity_id'=>2,'battery_charging_id'=>2,'utility_id'=>2,'price'=>28990000,'promotion_id'=>2,'stock_quantity'=>50],
            9 => ['screen_id'=>2,'rear_camera_id'=>3,'front_camera_id'=>2,'memory_id'=>3,'operating_system_id'=>2,'general_information_id'=>2,'communication_connectivity_id'=>2,'battery_charging_id'=>2,'utility_id'=>2,'price'=>19990000,'promotion_id'=>null,'stock_quantity'=>40],
            10 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>2,'general_information_id'=>3,'communication_connectivity_id'=>2,'battery_charging_id'=>3,'utility_id'=>3,'price'=>7990000,'promotion_id'=>null,'stock_quantity'=>150],
            11 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>2,'general_information_id'=>3,'communication_connectivity_id'=>2,'battery_charging_id'=>3,'utility_id'=>3,'price'=>5990000,'promotion_id'=>1,'stock_quantity'=>200],
            12 => ['screen_id'=>2,'rear_camera_id'=>3,'front_camera_id'=>2,'memory_id'=>3,'operating_system_id'=>2,'general_information_id'=>3,'communication_connectivity_id'=>2,'battery_charging_id'=>3,'utility_id'=>3,'price'=>23990000,'promotion_id'=>2,'stock_quantity'=>70],

            // =========================
            //      XIAOMI (13 → 16)
            // =========================
            13 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>3,'general_information_id'=>3,'communication_connectivity_id'=>3,'battery_charging_id'=>3,'utility_id'=>3,'price'=>5990000,'promotion_id'=>null,'stock_quantity'=>200],
            14 => ['screen_id'=>2,'rear_camera_id'=>4,'front_camera_id'=>3,'memory_id'=>3,'operating_system_id'=>3,'general_information_id'=>3,'communication_connectivity_id'=>3,'battery_charging_id'=>2,'utility_id'=>3,'price'=>18990000,'promotion_id'=>1,'stock_quantity'=>80],
            15 => ['screen_id'=>1,'rear_camera_id'=>4,'front_camera_id'=>3,'memory_id'=>3,'operating_system_id'=>3,'general_information_id'=>3,'communication_connectivity_id'=>3,'battery_charging_id'=>2,'utility_id'=>3,'price'=>13990000,'promotion_id'=>2,'stock_quantity'=>120],
            16 => ['screen_id'=>1,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>3,'general_information_id'=>3,'communication_connectivity_id'=>3,'battery_charging_id'=>3,'utility_id'=>3,'price'=>8990000,'promotion_id'=>null,'stock_quantity'=>150],

            // =========================
            //      OPPO (17 → 20)
            // =========================
            17 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>1,'general_information_id'=>1,'communication_connectivity_id'=>2,'battery_charging_id'=>1,'utility_id'=>3,'price'=>12990000,'promotion_id'=>1,'stock_quantity'=>90],
            18 => ['screen_id'=>2,'rear_camera_id'=>4,'front_camera_id'=>3,'memory_id'=>3,'operating_system_id'=>2,'general_information_id'=>3,'communication_connectivity_id'=>1,'battery_charging_id'=>2,'utility_id'=>1,'price'=>15990000,'promotion_id'=>null,'stock_quantity'=>70],
            19 => ['screen_id'=>3,'rear_camera_id'=>3,'front_camera_id'=>3,'memory_id'=>2,'operating_system_id'=>2,'general_information_id'=>1,'communication_connectivity_id'=>3,'battery_charging_id'=>2,'utility_id'=>3,'price'=>4990000,'promotion_id'=>null,'stock_quantity'=>300],
            20 => ['screen_id'=>2,'rear_camera_id'=>3,'front_camera_id'=>1,'memory_id'=>3,'operating_system_id'=>2,'general_information_id'=>2,'communication_connectivity_id'=>3,'battery_charging_id'=>3,'utility_id'=>1,'price'=>19990000,'promotion_id'=>3,'stock_quantity'=>40],
        ];

        foreach ($products as $id => $data) {
            $detail = ProductDetail::find($id);
            if ($detail) {
                $detail->update($data);
                $detail->load('promotion');
                $detail->final_price = $detail->calculateFinalPrice();
                $detail->save();
            }
        }
    }
}
