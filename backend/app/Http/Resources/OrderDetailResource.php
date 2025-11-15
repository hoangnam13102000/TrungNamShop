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
            // Optional: load productDetail relation
            'product_detail' => $this->whenLoaded('productDetail'),
        ];
    }
}
