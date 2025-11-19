<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $primaryImage = $this->images->firstWhere('is_primary', true);

        return [
            'id' => $this->id,
            'price' => $this->price,
            'final_price' => $this->final_price, // Lấy trực tiếp từ DB
            'stock_quantity' => $this->stock_quantity,

            'product' => new ProductResource($this->whenLoaded('product')),
            'screen' => new ScreenResource($this->whenLoaded('screen')),
            'rear_camera' => new RearCameraResource($this->whenLoaded('rearCamera')),
            'front_camera' => new FrontCameraResource($this->whenLoaded('frontCamera')),
            'memory' => new MemoryResource($this->whenLoaded('memory')),
            'operating_system' => new OperatingSystemResource($this->whenLoaded('operatingSystem')),
            'general_information' => new GeneralInformationResource($this->whenLoaded('generalInformation')),
            'communication_connectivity' => new CommunicationConnectivityResource($this->whenLoaded('communicationConnectivity')),
            'battery_charging' => new BatteryChargingResource($this->whenLoaded('batteryCharging')),
            'utility' => new UtilityResource($this->whenLoaded('utility')),

            'promotion' => $this->whenLoaded('promotion') ? [
                'id' => $this->promotion->id,
                'name' => $this->promotion->name,
                'description' => $this->promotion->description,
                'discount_percent' => $this->promotion->discount_percent,
                'start_date' => $this->promotion->start_date,
                'end_date' => $this->promotion->end_date,
                'status' => $this->promotion->status,
            ] : null,

            'primary_image' => $primaryImage ? asset('storage/' . $primaryImage->image_path) : null,
            'images' => $this->images->map(fn($img) => asset('storage/' . $img->image_path))->toArray(),
        ];
    }
}
