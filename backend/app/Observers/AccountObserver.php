<?php

namespace App\Observers;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Employee;
class AccountObserver
{
    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account): void
    {
        if ($account->account_type_id == 3) {
            if (!$account->customer) {
                Customer::create([
                    'account_id'   => $account->id,
                    'full_name'    => null,
                    'address'      => null,
                    'phone_number' => null,
                    'birth_date'   => null,
                    'gender'       => null,
                    'avatar'       => null,
                ]);
            }
        } else {
            // Tạo employee nếu chưa có
            if (!$account->employee) {
                Employee::create([
                    'account_id'   => $account->id,
                    'position_id'  => null,
                    'store_id'     =>null,
                    'warehouse_id' => null,
                    'full_name'    => null,
                    'phone_number' => null,
                    'address'      => null,
                    'birth_date'   => null,
                    'gender'       => null,
                    'avatar'       => null,
                    'created_at'=>  $account->created_at,
                    'is_active'    => true,
                ]);
            }
        }
    }

    /**
     * Handle the Account "updated" event.
     */
    public function updated(Account $account): void
    {
        //
    }

    /**
     * Handle the Account "deleted" event.
     */

     public function deleted(Account $account): void
    {
        //
    }
    public function deleting(Account $account): void
    {
        //Delete related Customer if exists
        if (empty($account->skipCustomerDelete) && $account->customer) {
            $account->customer->skipAccountDelete = true; // avoid loop
            $account->customer->delete();
        }
    }
   
    /**
     * Handle the Account "restored" event.
     */
    public function restored(Account $account): void
    {
        //
    }

    /**
     * Handle the Account "force deleted" event.
     */
    public function forceDeleted(Account $account): void
    {
        //
    }
}
