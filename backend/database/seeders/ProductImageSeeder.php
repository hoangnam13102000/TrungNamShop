<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        ProductImage::create([
            'product_id' => 1,
            'color_id' => 1,
            'image_path' => '/products/product1.jpg',
            'is_primary' => true,
        ]);

        // Tạo hình ảnh sản phẩm 2
        ProductImage::create([
            'product_id' => 2,
            'color_id' => 2,
            'image_path' => '/products/product2.jpg',
            'is_primary' => false,
        ]);

        ProductImage::create([
            'product_id' => 3,
            'color_id' =>1,
            'image_path' => '/products/product3.jpg',
            'is_primary' => true,
        ]);
    }
}
