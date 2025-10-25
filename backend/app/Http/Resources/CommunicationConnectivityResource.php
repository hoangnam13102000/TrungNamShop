<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunicationConnectivityResource extends JsonResource
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
            'nfc' => $this->nfc,
            'sim_slot' => $this->sim_slot,
            'mobile_network' => $this->mobile_network,
            'gps' => $this->gps,
        ];
    }
}
