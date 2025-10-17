<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AccountType;
class AccountTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['id' => 1, 'account_type_name' => 'Admin'],
            ['id' => 2, 'account_type_name' => 'Nhân viên'],
            ['id' => 3, 'account_type_name' => 'Khách hàng'],

        ];
        foreach ($types as $type) {
            AccountType::updateOrCreate(
                ['id' => $type['id']],
                ['account_type_name' => $type['account_type_name']]
            );
        }
       
    }
}
