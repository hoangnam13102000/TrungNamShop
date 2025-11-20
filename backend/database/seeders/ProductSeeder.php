<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            // -- Sản phẩm 1: iPhone 15 Pro
            [
                'brand_id' => 1,
                'name' => 'iPhone 15 Pro',
                'description' => 'Smartphone cao cấp Apple với màn hình Super Retina XDR.',
                'status' => true,
            ],

            // -- Sản phẩm 2: Samsung Galaxy S23
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S23',
                'description' => 'Điện thoại flagship Samsung với camera siêu nét.',
                'status' => true,
            ],

            // -- Sản phẩm 3: Xiaomi Redmi Note 13
            [
                'brand_id' => 3,
                'name' => 'Xiaomi Redmi Note 13',
                'description' => 'Điện thoại tầm trung cấu hình tốt, pin lâu.',
                'status' => true,
            ],

            // -- Sản phẩm 4: iPhone 14 Pro
            [
                'brand_id' => 1,
                'name' => 'iPhone 14 Pro',
                'description' => 'Dynamic Island, camera 48MP, chip A16.',
                'status' => true,
            ],

            // -- Sản phẩm 5: iPhone 14 Pro Max
            [
                'brand_id' => 1,
                'name' => 'iPhone 14 Pro Max',
                'description' => 'Màn lớn, pin trâu, camera cao cấp.',
                'status' => true,
            ],

            // -- Sản phẩm 6: iPhone 17
            [
                'brand_id' => 1,
                'name' => 'iPhone 17',
                'description' => 'Chip A15 Bionic, hiệu năng mạnh mẽ.',
                'status' => true,
            ],

            // -- Sản phẩm 7: Samsung Galaxy S23 (SAMSUNG)
            [
                'brand_id' => 1,
                'name' => 'Samsung Galaxy S23',
                'description' => 'Flagship Samsung với Snapdragon 8 Gen 2.',
                'status' => true,
            ],

            // -- Sản phẩm 8: Samsung Galaxy S23 Ultra
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S23 Ultra',
                'description' => 'Camera 200MP, zoom siêu xa, pin lớn.',
                'status' => true,
            ],

            // -- Sản phẩm 9: Samsung Galaxy S22 Ultra
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S22 Ultra',
                'description' => 'Có bút S Pen, màn hình lớn, camera mạnh.',
                'status' => true,
            ],

            // -- Sản phẩm 10: Samsung Galaxy A54
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy A54',
                'description' => 'Điện thoại tầm trung với camera ổn định.',
                'status' => true,
            ],

            // -- Sản phẩm 11: Samsung Galaxy A34
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy A34',
                'description' => 'Màn AMOLED 90Hz, pin 5000mAh.',
                'status' => true,
            ],

            // -- Sản phẩm 12: Samsung Galaxy Z Flip 5
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy Z Flip 5',
                'description' => 'Điện thoại gập thời trang, hiệu năng mạnh.',
                'status' => true,
            ],

            // -- Sản phẩm 13: Xiaomi Redmi Note 14
            [
                'brand_id' => 3,
                'name' => 'Xiaomi Redmi Note 14',
                'description' => 'Điện thoại tầm trung giá rẻ, pin trâu.',
                'status' => true,
            ],

            // -- Sản phẩm 14: Xiaomi 13 Pro
            [
                'brand_id' => 3,
                'name' => 'Xiaomi 13 Pro',
                'description' => 'Flagship với camera Leica, hiệu năng cực mạnh.',
                'status' => true,
            ],

            // -- Sản phẩm 15: Xiaomi 12T Pro
            [
                'brand_id' => 3,
                'name' => 'Xiaomi 12T Pro',
                'description' => 'Camera 200MP, sạc siêu nhanh 120W.',
                'status' => true,
            ],

            // -- Sản phẩm 16: Poco F5
            [
                'brand_id' => 3,
                'name' => 'Poco F5',
                'description' => 'Chip Snapdragon mạnh, giá mềm.',
                'status' => true,
            ],

            // -- Sản phẩm 17: Oppo Reno13 Pro
            [
                'brand_id' => 4,
                'name' => 'Oppo Reno13 Pro',
                'description' => 'Camera chân dung đẹp, sạc nhanh 80W.',
                'status' => true,
            ],

            // -- Sản phẩm 18: Oppo Reno14 Pro
            [
                'brand_id' => 4,
                'name' => 'Oppo Reno14 Pro',
                'description' => 'Thiết kế đẹp, camera mạnh, chip Dimensity.',
                'status' => true,
            ],

            // -- Sản phẩm 19: Oppo A6
            [
                'brand_id' => 4,
                'name' => 'Oppo A6',
                'description' => 'Máy tầm trung, pin 5000mAh, sạc nhanh.',
                'status' => true,
            ],

            // -- Sản phẩm 20: Oppo Find X5 Pro
            [
                'brand_id' => 4,
                'name' => 'Oppo Find X5 Pro',
                'description' => 'Flagship với camera Hasselblad và hiệu năng cao.',
                'status' => true,
            ],
        ];
    }
}
