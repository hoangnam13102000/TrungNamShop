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
        
        Store::create([
            'name'=> 'Cửa hàng 23',
            'address'=> 'Đường số 9, Hiệp Bình Phước, Q.Thủ Đức, TP.HCM',
            'email'=>'support@TechPhone23.com',
            'phone'=>'18008106',
            'google_map'=>'https://maps.app.goo.gl/eW977Vfkqsn65Mnt9',
        ]);
    }
}
