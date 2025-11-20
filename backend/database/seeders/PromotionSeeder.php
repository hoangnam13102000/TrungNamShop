<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('promotions')->insert([
             [
                'name' => 'Không áp dụng',
                'description' => null,
                'discount_percent' => 0,
                'start_date' => '2025-01-20',
                'end_date' => '2025-02-05',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Khuyến mãi Tết 2025',
                'description' => 'Giảm giá nhiều sản phẩm điện thoại nhân dịp Tết 2025.',
                'discount_percent' => 20,
                'start_date' => '2025-01-20',
                'end_date' => '2025-02-05',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sale Tháng 3 Mừng ngày Quốc tế Phụ nữ',
                'description' => 'Giảm giá lên đến 30% cho nhiều mẫu điện thoại.',
                'discount_percent' => 30,
                'start_date' => '2025-03-01',
                'end_date' => '2025-03-10',
                'status' => 'inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mega Sale 6.6',
                'description' => 'Ưu đãi lớn 6.6 cho các thương hiệu Apple, Samsung, Xiaomi.',
                'discount_percent' => 30,
                'start_date' => '2025-06-01',
                'end_date' => '2025-06-10',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sinh nhật cửa hàng',
                'description' => 'Khuyến mãi mừng sinh nhật cửa hàng TechPhone.',
                'discount_percent' => 25,
                'start_date' => '2025-08-15',
                'end_date' => '2025-08-30',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
