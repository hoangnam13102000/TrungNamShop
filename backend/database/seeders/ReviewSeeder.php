<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ lấy account_type_id = 3 (khách hàng)
        $accountIds = DB::table('accounts')
            ->where('account_type_id', 3)
            ->pluck('id')
            ->toArray();

        $productIds = DB::table('products')->pluck('id')->toArray();

        if (empty($accountIds) || empty($productIds)) {
            $this->command->info('Không có account khách hàng hoặc product nào trong database.');
            return;
        }

        $sampleReviews = [
            "Máy có thiết kế sang trọng, cầm vừa tay và màn hình hiển thị sắc nét. Camera chụp đẹp, màu trung thực.",
            "Pin trâu, sử dụng cả ngày không lo hết. Hiệu năng ổn định, mở nhiều ứng dụng vẫn mượt mà.",
            "Camera trước rất tốt, selfie đẹp. Tuy nhiên máy hơi nóng khi chơi game nặng.",
            "Loa ngoài hơi nhỏ, nhưng tổng thể máy tốt, đáng giá với mức giá hiện tại.",
            "Màn hình sáng, cảm ứng nhạy. Hệ điều hành mượt, giao diện trực quan và dễ dùng.",
            "Dung lượng RAM lớn giúp mở nhiều app cùng lúc không lag. Pin sạc nhanh, tiện lợi.",
            "Thiết kế đẹp, trọng lượng nhẹ. Camera sau nhiều tính năng, quay video 4K mượt.",
            "Pin dùng lâu, màn hình AMOLED sáng và màu sắc sống động. Chơi game ổn định.",
            "Máy chạy mượt, ít lag. Âm thanh tốt nhưng hơi ít bass khi mở nhạc lớn.",
            "Tính năng bảo mật tốt, nhận diện khuôn mặt nhanh. Tổng thể rất hài lòng.",
        ];

        $reviews = [];

        for ($i = 0; $i < 20; $i++) {
            $reviews[] = [
                'account_id' => $accountIds[array_rand($accountIds)],
                'product_id' => $productIds[array_rand($productIds)],
                'content' => $sampleReviews[array_rand($sampleReviews)],
                'stars' => rand(3, 5),
                'status' => true,
                'created_at' => Carbon::now()->subDays(rand(0, 90)),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('reviews')->insert($reviews);
    }
}
