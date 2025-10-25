<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScreenResource extends JsonResource
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
            'screen_size' => $this->screen_size,
            'display_technology' => $this->display_technology,
            'resolution' => $this->resolution,
            'max_brightness' => $this->max_brightness,
            'glass_protection' => $this->glass_protection,
        ];
    }
}
