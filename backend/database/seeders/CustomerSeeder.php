<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Account;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customersData = [
            'customer1' => [
                'full_name'    => 'Nguyễn Văn A',
                'address'      => '123 Đường Lê Lợi, Quận 1, TP.HCM',
                'phone_number' => '0123456789',
                'email'        => 'nguyenvana@example.com',
                'birth_date'   => '1990-01-01',
                'gender'       => 'male',
                'avatar'       => '/customers/customer1.webp',
            ],
            'customer2' => [
                'full_name'    => 'Trần Thị B',
                'address'      => '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
                'phone_number' => '0987654321',
                'email'        => 'tranthib@example.com',
                'birth_date'   => '1992-05-10',
                'gender'       => 'female',
                'avatar'       => '/customers/customer2.webp',
            ],
            'customer3' => [
                'full_name'    => 'Lê Văn C',
                'address'      => '789 Đường Phạm Ngũ Lão, Quận 1, TP.HCM',
                'phone_number' => '0912345678',
                'email'        => 'levanc@example.com',
                'birth_date'   => '1988-08-20',
                'gender'       => 'male',
                'avatar'       => '/customers/customer3.webp',
            ],
        ];

        foreach ($customersData as $username => $data) {
            $account = Account::where('username', $username)->first();

            if ($account) {
                $customer = $account->customer;

                if ($customer) {
                    $customer->update($data);
                } else {
                    Customer::create(array_merge($data, ['account_id' => $account->id]));
                }
            }
        }
    }
}
