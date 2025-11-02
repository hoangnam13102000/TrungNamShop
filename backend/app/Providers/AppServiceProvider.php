<?php

namespace App\Providers;

//-----------Account and Customer---------------------

use Illuminate\Support\ServiceProvider;
use App\Models\Account;
use App\Observers\AccountObserver;

use App\Models\Customer;
use App\Observers\CustomerObserver;


//-----------Product and Brand---------------------

use App\Models\Product;
use App\Observers\ProductObserver;

use App\Models\Brand;
use App\Observers\BrandObserver;

use App\Models\ProductDetail;
use App\Observers\ProductDetailObserver;

use App\Models\ProductImage;
use App\Observers\ProductImageObserver;
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
        //-----------Account and Customer---------------------

         Account::observe(AccountObserver::class);
         Customer::observe(CustomerObserver::class);

        //-----------Product and Brand---------------------
        Product::observe(ProductObserver::class);
        Brand::observe(BrandObserver::class);

        ProductDetail::observe(ProductDetailObserver::class);

        ProductImage::observe(ProductImageObserver::class);
    }
}
