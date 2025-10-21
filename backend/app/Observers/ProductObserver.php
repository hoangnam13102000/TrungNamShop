<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function creating(Product $product): void
    {
        $product->name = ucfirst($product->name);
        if (!isset($product->status)) {
            $product->status = true;
        }
    }
    public function created(Product $product): void
    {
        Log::info("Product created", ['id' => $product->id, 'brand_id' => $product->brand_id]);
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        Log::info(" Product updated", ['id' => $product->id]);
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
         Log::warning(" Product soft deleted", ['id' => $product->id]);
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        //
    }
}
