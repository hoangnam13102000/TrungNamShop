<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Get product_detail 
        $detail = $this->details()->latest()->first();

        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->description,
            'status'        => (bool) $this->status,
            'price'         => optional($detail)->price,

            'final_price'   => optional($detail)->final_price,

            'brand'         => new BrandResource($this->whenLoaded('brand')),
            'primary_image' => $this->images()->where('is_primary', true)->first(),
        ];
    }
}
