<?php

namespace App\Observers;
use App\Models\Memory;
use App\Models\Utility;
use App\Models\ProductDetail;

class ProductDetailObserver
{
    /**
     * Handle the ProductDetail "created" event.
     */
   
     public function creating(ProductDetail $detail)
    {
         // =========================
        // Memory
        // =========================
        if (!isset($detail->memory_id) && ($detail->memory_internal || $detail->memory_external || $detail->memory_slot)) {
            $memory = Memory::firstOrCreate([
                'internal' => $detail->memory_internal ?? null,
                'external' => $detail->memory_external ?? null,
                'slot' => $detail->memory_slot ?? null,
            ]);
            $detail->memory_id = $memory->id;
        }

        // =========================
        // Utilities
        // =========================
        // Lưu mảng utilities_data nếu có
        if (!empty($detail->utilities_data) && is_array($detail->utilities_data)) {
            // tạm lưu dữ liệu trong thuộc tính tạm để xử lý sau khi ProductDetail được tạo
            $detail->utilities_pending = $detail->utilities_data;
        }
    }
     public function created(ProductDetail $detail): void
    {
        // Sau khi ProductDetail tạo xong, gắn utilities
        if (!empty($detail->utilities_pending)) {
            foreach ($detail->utilities_pending as $uData) {
                $utility = Utility::firstOrCreate([
                    'advanced_security' => $uData['advanced_security'] ?? null,
                    'special_features' => $uData['special_features'] ?? null,
                    'water_dust_resistance' => $uData['water_dust_resistance'] ?? null,
                ]);
                $detail->utilities()->attach($utility->id);
            }
        }
    }
    /**
     * Handle the ProductDetail "updated" event.
     */
    public function updated(ProductDetail $productDetail): void
    {
        //
    }

    /**
     * Handle the ProductDetail "deleted" event.
     */
    public function deleted(ProductDetail $productDetail): void
    {
        //
    }

    /**
     * Handle the ProductDetail "restored" event.
     */
    public function restored(ProductDetail $productDetail): void
    {
        //
    }

    /**
     * Handle the ProductDetail "force deleted" event.
     */
    public function forceDeleted(ProductDetail $productDetail): void
    {
        //
    }
}
