<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Account;
use App\Observers\AccountObserver;

use App\Models\Customer;
use App\Observers\CustomerObserver;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         Account::observe(AccountObserver::class);
         Customer::observe(CustomerObserver::class);
    }
}
