<?php

namespace App\Observers;

use App\Models\Account;
use App\Models\Customer;
class AccountObserver
{
    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account): void
    {
        if (!$account->customer) {
            Customer::create([
                'account_id' => $account->id,
                'full_name' => null,
                'address' => null,
                'phone_number' => null,
                'email' => null,
                'birth_date' => null,
                'gender' => null,
            ]);
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
