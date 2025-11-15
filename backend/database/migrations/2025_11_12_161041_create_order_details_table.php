<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();

            // Liên kết với đơn hàng
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade');

            // Liên kết với chi tiết sản phẩm
            $table->foreignId('product_detail_id')
                  ->nullable()
                  ->constrained('product_details')
                  ->onDelete('set null');

            // Lưu snapshot thông tin sản phẩm
            $table->string('product_name', 191)->comment('Tên sản phẩm tại thời điểm đặt hàng');
            $table->string('detail_info', 255)->nullable()->comment('Thông tin chi tiết (RAM/ROM/Màu) tại thời điểm đặt hàng');

            // Chi tiết đơn hàng
            $table->integer('quantity')->default(1);
            $table->decimal('price_at_order', 15, 2)->comment('Giá bán của sản phẩm tại thời điểm đặt hàng');
            $table->decimal('subtotal', 15, 2)->default(0.00)->comment('Thành tiền = quantity * price_at_order');

            $table->timestamps();
            $table->softDeletes(); // cho phép xóa mềm
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
