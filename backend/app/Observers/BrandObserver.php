<?php

namespace App\Observers;

use App\Models\Brand;
use Illuminate\Support\Facades\Log;

class BrandObserver
{
    /**
     * Handle the Brand "created" event.
     */
    public function created(Brand $brand): void
    {
        Log::info(" Brand created", ['id' => $brand->id, 'name' => $brand->name]);
    }

    /**
     * Handle the Brand "updated" event.
     */
    public function updated(Brand $brand): void
    {
        Log::info("Brand updated", ['id' => $brand->id]);
    }

    /**
     * Handle the Brand "deleted" event.
     */
    public function deleted(Brand $brand): void
    {
        $brand->products()->delete();
        Log::warning("Brand {$brand->id} deleted, all products soft deleted.");
    }

    /**
     * Handle the Brand "restored" event.
     */
    public function restored(Brand $brand): void
    {
        //
    }

    /**
     * Handle the Brand "force deleted" event.
     */
    public function forceDeleted(Brand $brand): void
    {
        //
    }
}
