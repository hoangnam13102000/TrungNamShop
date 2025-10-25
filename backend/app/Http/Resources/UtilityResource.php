<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilityResource extends JsonResource
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
            'advanced_security' => $this->advanced_security,
            'special_features' => $this->special_features,
            'water_dust_resistance' => $this->water_dust_resistance,
        ];
    }
}
