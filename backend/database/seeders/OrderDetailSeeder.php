<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\ProductDetail;

class OrderDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::all();
        $productDetails = ProductDetail::with('product')->get();

        if ($orders->isEmpty() || $productDetails->isEmpty()) {
            $this->command->info("Không có order hoặc product_detail để seed.");
            return;
        }

        foreach ($orders as $order) {
            // Chọn 1-3 product_detail ngẫu nhiên cho mỗi đơn
            $items = $productDetails->random(rand(1, min(3, $productDetails->count())));

            foreach ($items as $productDetail) {
                $quantity = rand(1, 5);
                $price = $productDetail->price ?? rand(100000, 5000000); // Giá mặc định nếu chưa có price

                DB::table('order_details')->insert([
                    'order_id' => $order->id,
                    'product_detail_id' => $productDetail->id,
                    'product_name' => $productDetail->product->name ?? 'Unknown', // Bắt buộc
                    'detail_info' => $productDetail->detail_info ?? Str::random(5),
                    'quantity' => $quantity,
                    'price_at_order' => $price,
                    'subtotal' => $quantity * $price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info("Đã seed xong order_details.");
    }
}
