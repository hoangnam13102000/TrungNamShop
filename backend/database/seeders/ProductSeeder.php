<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'brand_id' => 1,
                'name' => 'iPhone 15 Pro',
                'description' => 'Smartphone cao cấp Apple với màn hình Super Retina XDR.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S23',
                'description' => 'Điện thoại flagship Samsung với camera siêu nét.',
                'status' => true,
            ],
            [
                'brand_id' => 3,
                'name' => 'Xiaomi Redmi Note 13',
                'description' => 'Điện thoại tầm trung cấu hình tốt, pin lâu.',
                'status' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
