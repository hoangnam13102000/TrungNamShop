<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       Store::create([
            'name'=> 'Không có',
            'address'=> 'Không có',
            'google_map'=>null,
        ]);
        
        Store::create([
            'name'=> 'Cửa hàng 65',
            'address'=> '65 Đ. Huỳnh Thúc Kháng, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam',
            'google_map'=>'https://www.google.com/maps/place/65+%C4%90.+Hu%E1%BB%B3nh+Th%C3%BAc+Kh%C3%A1ng,+B%E1%BA%BFn+Ngh%C3%A9,+Qu%E1%BA%ADn+1,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.7719448,106.6986887,17z/data=!3m1!4b1!4m6!3m5!1s0x31752f40c7a0f411:0xe272a9c70ba4a66e!8m2!3d10.7719448!4d106.7012636!16s%2Fg%2F11c26xb1g_?entry=ttu',
        ]);
    }
}
