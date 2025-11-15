<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('warehouses')->insert([
            [
                'name' => 'Kho Trung Tâm Hà Nội',
                'address' => 'Số 123 Phạm Hùng, Nam Từ Liêm, Hà Nội',
                'note' => 'Kho chính miền Bắc',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Kho Hồ Chí Minh',
                'address' => '456 Lê Văn Việt, Thủ Đức, TP. Hồ Chí Minh',
                'note' => 'Kho chính miền Nam',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Kho Đà Nẵng',
                'address' => '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                'note' => 'Kho trung chuyển miền Trung',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
