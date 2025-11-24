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
                'brand_id' => 1,
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
            [
                'brand_id' => 1,
                'name' => 'iPhone 14 Pro',
                'description' => 'Dynamic Island, camera 48MP, chip A16.',
                'status' => true,
            ],
            [
                'brand_id' => 1,
                'name' => 'iPhone 14 Pro Max',
                'description' => 'Màn lớn, pin trâu, camera cao cấp.',
                'status' => true,
            ],
            [
                'brand_id' => 1,
                'name' => 'iPhone 17',
                'description' => 'Chip A15 Bionic, hiệu năng mạnh mẽ.',
                'status' => true,
            ],
            [
                'brand_id' => 1,
                'name' => 'Samsung Galaxy S23',
                'description' => 'Flagship Samsung với Snapdragon 8 Gen 2.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S23 Ultra',
                'description' => 'Camera 200MP, zoom siêu xa, pin lớn.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy S22 Ultra',
                'description' => 'Có bút S Pen, màn hình lớn, camera mạnh.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy A54',
                'description' => 'Điện thoại tầm trung với camera ổn định.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy A34',
                'description' => 'Màn AMOLED 90Hz, pin 5000mAh.',
                'status' => true,
            ],
            [
                'brand_id' => 2,
                'name' => 'Samsung Galaxy Z Flip 5',
                'description' => 'Điện thoại gập thời trang, hiệu năng mạnh.',
                'status' => true,
            ],
            [
                'brand_id' => 3,
                'name' => 'Xiaomi Redmi Note 14',
                'description' => 'Điện thoại tầm trung giá rẻ, pin trâu.',
                'status' => true,
            ],
            [
                'brand_id' => 3,
                'name' => 'Xiaomi 13 Pro',
                'description' => 'Flagship với camera Leica, hiệu năng cực mạnh.',
                'status' => true,
            ],
            [
                'brand_id' => 3,
                'name' => 'Xiaomi 12T Pro',
                'description' => 'Camera 200MP, sạc siêu nhanh 120W.',
                'status' => true,
            ],
            [
                'brand_id' => 3,
                'name' => 'Poco F5',
                'description' => 'Chip Snapdragon mạnh, giá mềm.',
                'status' => true,
            ],
            [
                'brand_id' => 4,
                'name' => 'Oppo Reno13 Pro',
                'description' => 'Camera chân dung đẹp, sạc nhanh 80W.',
                'status' => true,
            ],
            [
                'brand_id' => 4,
                'name' => 'Oppo Reno14 Pro',
                'description' => 'Thiết kế đẹp, camera mạnh, chip Dimensity.',
                'status' => true,
            ],
            [
                'brand_id' => 4,
                'name' => 'Oppo A6',
                'description' => 'Máy tầm trung, pin 5000mAh, sạc nhanh.',
                'status' => true,
            ],
            [
                'brand_id' => 4,
                'name' => 'Oppo Find X5 Pro',
                'description' => 'Flagship với camera Hasselblad và hiệu năng cao.',
                'status' => true,
            ],
        ];

        // ⭐⭐ BẠN ĐANG THIẾU PHẦN NÀY ⭐⭐
        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
