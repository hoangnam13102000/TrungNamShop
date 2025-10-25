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
        return [
            'id' => $this->id,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'product' => new ProductResource($this->whenLoaded('product')),
            'color' => $this->color?->name,
            'screen' => new ScreenResource($this->whenLoaded('screen')),
            'rear_camera' => new RearCameraResource($this->whenLoaded('rearCamera')),
            'front_camera' => new FrontCameraResource($this->whenLoaded('frontCamera')),
            'memory' => new MemoryResource($this->whenLoaded('memory')),
            'operating_system' => new OperatingSystemResource($this->whenLoaded('operatingSystem')),
            'battery' => new BatteryResource($this->whenLoaded('batteryCharging')),
            'utility' => new UtilityResource($this->whenLoaded('utility')),
            'communication' => new CommunicationConnectivityResource($this->whenLoaded('communicationConnectivity')),
            'general_information' => new GeneralInformationResource($this->whenLoaded('generalInformation')),

        ];
    }
}
