<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use function Laravel\Prompts\table;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    //    Store::create([
    //         'name'=> 'Không có',
    //         'address'=> 'Không có',
    //         'email'=>'Không có',
    //         'phone'=>'Không có',
    //         'google_map'=>null,
    //     ]);
        
    //     Store::create([
    //         'name'=> 'Cửa hàng 65',
    //         'address'=> 'Đường số 7, Hiệp Bình Phước, Q.Thủ Đức, TP.HCM',
    //         'email'=>'support@TechPhone.com',
    //         'phone'=>'18008106',
    //         'google_map'=>'https://maps.app.goo.gl/eW977Vfkqsn65Mnt9',
    //     ]);
    }
}
