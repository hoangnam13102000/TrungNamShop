<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FrontCameraResource extends JsonResource
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
            'resolution' => $this->resolution,
            'aperture' => $this->aperture,
            'video_capability' => $this->video_capability,
            'features' => $this->features,
        ];
    }
}
