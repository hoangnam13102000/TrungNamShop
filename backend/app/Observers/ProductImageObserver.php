<?php

namespace App\Observers;

use App\Models\ProductImage;
use App\Models\ProductDetail;

class ProductImageObserver
{
    /**
     * Handle the ProductImage "created" event.
     */
    public function created(ProductImage $productImage): void
    {
        if ($productImage->product_detail_id) {
            return;
        }

        
        $productDetail = ProductDetail::create([
            'product_id' => $productImage->product_id,
            'price' => null,
            'stock_quantity' => 0,
        ]);

        $productImage->update([
            'product_detail_id' => $productDetail->id,
        ]);
    }

    /**
     * Handle the ProductImage "updated" event.
     */
    public function updated(ProductImage $productImage): void
    {
        //
    }

    /**
     * Handle the ProductImage "deleted" event.
     */
    public function deleted(ProductImage $productImage): void
    {
        //
    }

    /**
     * Handle the ProductImage "restored" event.
     */
    public function restored(ProductImage $productImage): void
    {
        //
    }

    /**
     * Handle the ProductImage "force deleted" event.
     */
    public function forceDeleted(ProductImage $productImage): void
    {
        //
    }
}
