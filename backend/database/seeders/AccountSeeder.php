<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Customer
        Account::create([
            'account_type_id' => 3,
            'account_level_id' => 1,
            'username' => 'customer1',
            'password' => '123456',
            'reward_points' => 0,
            'status' => 1,
        ]);

        Account::create([
            'account_type_id' => 3,
            'account_level_id' => 1,
            'username' => 'customer2',
            'password' => '123456',
            'reward_points' => 0,
            'status' => 1,
        ]);

        Account::create([
            'account_type_id' => 3,
            'account_level_id' => 1,
            'username' => 'customer3',
            'password' => '123456',
            'reward_points' => 0,
            'status' => 1,
        ]);

        // Employee
        Account::create([
            'account_type_id' => 2,
            'account_level_id' => 1,
            'username' => 'employee1',
            'password' => '123456',
            'reward_points' => 0,
            'status' => 1,
        ]);

        Account::create([
            'account_type_id' => 2,
            'account_level_id' => 1,
            'username' => 'employee2',
            'password' => '123456',
            'reward_points' => 0,
            'status' => 1,
        ]);
    }
}
