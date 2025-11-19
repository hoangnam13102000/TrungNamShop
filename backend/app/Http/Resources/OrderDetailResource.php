<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_detail_id' => $this->product_detail_id,
            'product_name' => $this->product_name,
            'detail_info' => $this->detail_info,
            'quantity' => $this->quantity,
            'price_at_order' => $this->price_at_order,
            'subtotal' => $this->subtotal,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Chỉ lấy product_id, memory ram và images
            'product_detail' => $this->whenLoaded('productDetail', function () {
                return [
                    'id' => $this->productDetail->id,
                    'memory' => $this->productDetail->memory?->ram ?? null, // chỉ lấy ram
                    'product' => $this->productDetail->product ? [
                        'product_id' => $this->productDetail->product->id,
                        'name' => $this->productDetail->product->name,
                        'images' => $this->productDetail->product->images->map(fn($img) => [
                            'image_path' => $img->image_path,
                            'is_primary' => $img->is_primary
                        ]),
                    ] : null,
                ];
            }),
        ];
    }
}
