<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BatteryChargingResource extends JsonResource
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
            'battery_capacity' => $this->battery_capacity,
            'charging_port' => $this->charging_port,
            'charging' => $this->charging,
        ];
    }
}
