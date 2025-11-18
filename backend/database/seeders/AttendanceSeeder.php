<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Account;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        // Tìm account theo username
        $account = Account::where('username', 'employee1')->first();

        if ($account && $account->employee) {
            Attendance::create([
                'employee_id' => $account->employee->id, // lấy employee_id từ quan hệ
                'salary_coefficient_id' => 1,
                'allowance_id' => 1,
                'reward_id' => 1,
                'month' => 11,
                'year' => 2025,
                'work_days' => 22,
                'advance_payment' => 500000,
            ]);
        }

        // Tạo cho employee2
        $account2 = Account::where('username', 'employee2')->first();

        if ($account2 && $account2->employee) {
            Attendance::create([
                'employee_id' => $account2->employee->id,
                'salary_coefficient_id' => 2,
                'allowance_id' => 1,
                'reward_id' => 2,
                'month' => 11,
                'year' => 2025,
                'work_days' => 20,
                'advance_payment' => 200000,
            ]);
        }
    }
}
