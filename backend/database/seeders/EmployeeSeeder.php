<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employeesData = [
            'employee1' => [
                'full_name'    => 'Trần Thị B',
                'address'      => '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
                'phone_number' => '0987654321',
                'birth_date'   => '1992-05-15',
                'gender'       => 'female',
                'avatar'       => '/employees/employee1.webp',
                'position_id'  => 2,
                'store_id'     => 1,
                'warehouse_id' => null,
                'is_active'    => true,
            ],
            'employee2' => [
                'full_name'    => 'Nguyễn Văn C',
                'address'      => '789 Đường Hai Bà Trưng, Quận 1, TP.HCM',
                'phone_number' => '0987654322',
                'birth_date'   => '1990-12-20',
                'gender'       => 'male',
                'avatar'       => '/employees/employee2.webp',
                'position_id'  => 2,
                'store_id'     => 1,
                'warehouse_id' => null,
                'is_active'    => true,
            ],
        ];

        foreach ($employeesData as $username => $data) {
            $account = Account::where('username', $username)->first();

            if ($account) {
                $employee = $account->employee ?: Employee::create(['account_id' => $account->id]);
                $employee->update($data);
            }
        }
    }
}
