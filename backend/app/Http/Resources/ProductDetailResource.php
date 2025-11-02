<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // image (primary)
        $primaryImage = $this->images->firstWhere('is_primary', true);

        return [
            'id' => $this->id,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,

            // Relation
            'product' => new ProductResource($this->whenLoaded('product')),
            'screen' => new ScreenResource($this->whenLoaded('screen')),
            'rear_camera' => new RearCameraResource($this->whenLoaded('rearCamera')),
            'front_camera' => new FrontCameraResource($this->whenLoaded('frontCamera')),
            'memory' => new MemoryResource($this->whenLoaded('memory')),
            'operating_system' => new OperatingSystemResource($this->whenLoaded('operatingSystem')),
            'battery_charging' => new BatteryChargingResource($this->whenLoaded('batteryCharging')),
            'utility' => new UtilityResource($this->whenLoaded('utility')),
            'communication_connectivity' => new CommunicationConnectivityResource($this->whenLoaded('communicationConnectivity')),
            'general_information' => new GeneralInformationResource($this->whenLoaded('generalInformation')),

            // image
            'primary_image' => $primaryImage ? asset('storage/' . $primaryImage->image_path) : null,
            'images' => $this->images->map(fn($img) => asset('storage/' . $img->image_path))->toArray(),
        ];
    }
}
