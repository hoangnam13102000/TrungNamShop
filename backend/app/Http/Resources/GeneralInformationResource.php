<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GeneralInformationResource extends JsonResource
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
            'design' => $this->design,
            'material' => $this->material,
            'dimensions' => $this->dimensions,
            'weight' => $this->weight,
            'launch_time' => $this->launch_time ? $this->launch_time->format('Y-m-d') : null,
        ];
    }
}
