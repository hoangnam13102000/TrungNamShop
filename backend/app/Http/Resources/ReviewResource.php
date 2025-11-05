<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'name' => $this->account->username, 
            'product_id' => $this->product_id,
            'content' => $this->content,
            'stars' => $this->stars,
            'date' => $this->created_at->format('Y-m-d'),
        ];
    }
}
