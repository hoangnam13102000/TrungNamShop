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
            'is_primary' => true,
        ]);

        ProductImage::create([
            'product_id' => 3,
            'color_id' =>1,
            'image_path' => '/products/product3.jpg',
            'is_primary' => true,
        ]);
         ProductImage::create([
            'product_id' => 4,
            'color_id' => 1,
            'image_path' => '/products/product4.jpg',
            'is_primary' => true,
        ]);

        // Product 5
        ProductImage::create([
            'product_id' => 5,
            'color_id' => 5,
            'image_path' => '/products/product5.webp',
            'is_primary' => true,
        ]);

        // Product 6
        ProductImage::create([
            'product_id' => 6,
            'color_id' => 2,
            'image_path' => '/products/product6.jpg',
            'is_primary' => true,
        ]);

        // Product 7
        ProductImage::create([
            'product_id' => 7,
            'color_id' => 2,
            'image_path' => '/products/product7.jpg',
            'is_primary' => true,
        ]);

        // Product 8
        ProductImage::create([
            'product_id' => 8,
            'color_id' => 3,
            'image_path' => '/products/product8.jpg',
            'is_primary' => true,
        ]);

        // Product 9
        ProductImage::create([
            'product_id' => 9,
            'color_id' => 4,
            'image_path' => '/products/product9.jpg',
            'is_primary' => true,
        ]);

        // Product 10
        ProductImage::create([
            'product_id' => 10,
            'color_id' => 5,
            'image_path' => '/products/product10.jpg',
            'is_primary' => true,
        ]);

        // Product 11
        ProductImage::create([
            'product_id' => 11,
            'color_id' => 1,
            'image_path' => '/products/product11.jpg',
            'is_primary' => true,
        ]);

        // Product 12
        ProductImage::create([
            'product_id' => 12,
            'color_id' => 2,
            'image_path' => '/products/product12.jpg',
            'is_primary' => true,
        ]);

        // Product 13
        ProductImage::create([
            'product_id' => 13,
            'color_id' => 3,
            'image_path' => '/products/product13.jpg',
            'is_primary' => true,
        ]);

        // Product 14
        ProductImage::create([
            'product_id' => 14,
            'color_id' => 4,
            'image_path' => '/products/product14.jpg',
            'is_primary' => true,
        ]);

        // Product 15
        ProductImage::create([
            'product_id' => 15,
            'color_id' => 5,
            'image_path' => '/products/product15.jpg',
            'is_primary' => true,
        ]);

        // Product 16
        ProductImage::create([
            'product_id' => 16,
            'color_id' => 1,
            'image_path' => '/products/product16.jpg',
            'is_primary' => true,
        ]);

        // Product 17
        ProductImage::create([
            'product_id' => 17,
            'color_id' => 2,
            'image_path' => '/products/product17.jpg',
            'is_primary' => true,
        ]);

        // Product 18
        ProductImage::create([
            'product_id' => 18,
            'color_id' => 3,
            'image_path' => '/products/product18.jpg',
            'is_primary' => true,
        ]);

        // Product 19
        ProductImage::create([
            'product_id' => 19,
            'color_id' => 4,
            'image_path' => '/products/product19.jpg',
            'is_primary' => true,
        ]);

        // Product 20
        ProductImage::create([
            'product_id' => 20,
            'color_id' => 5,
            'image_path' => '/products/product20.jpg',
            'is_primary' => true,
        ]);
    }
}
