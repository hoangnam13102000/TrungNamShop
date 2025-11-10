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
            'stock_quantity' => $this->stock_quantity,

            // Relations
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

            // Images
            'primary_image' => $primaryImage ? asset('storage/' . $primaryImage->image_path) : null,
            'images' => $this->images->map(fn($img) => asset('storage/' . $img->image_path))->toArray(),
        ];
    }
}
