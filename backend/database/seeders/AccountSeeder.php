<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ================= CUSTOMER =================
        Account::create([
            'account_type_id'  => 3,
            'account_level_id' => 1,
            'username'         => 'customer1',
            'email'            => 'customer1@gmail.com',
            'password'         => '123456',
            'reward_points'    => 0,
            'status'           => 1,
        ]);

        Account::create([
            'account_type_id'  => 3,
            'account_level_id' => 1,
            'username'         => 'customer2',
            'email'            => 'hoangnam131020@gmail.com',
            'password'         => '123456',
            'reward_points'    => 0,
            'status'           => 1,
        ]);

        Account::create([
            'account_type_id'  => 3,
            'account_level_id' => 1,
            'username'         => 'customer3',
            'email'            => 'customer3@gmail.com',
            'password'         => '123456',
            'reward_points'    => 0,
            'status'           => 1,
        ]);

        // ================= EMPLOYEE =================
        Account::create([
            'account_type_id'  => 2,
            'account_level_id' => 1,
            'username'         => 'employee1',
            'email'            => 'employee1@gmail.com',
            'password'         => '123456',
            'reward_points'    => 0,
            'status'           => 1,
        ]);

        Account::create([
            'account_type_id'  => 2,
            'account_level_id' => 1,
            'username'         => 'employee2',
            'email'            => 'employee2@gmail.com',
            'password'         => '123456',
            'reward_points'    => 0,
            'status'           => 1,
        ]);
    }
}
