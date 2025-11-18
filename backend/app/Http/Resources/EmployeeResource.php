<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'full_name' => $this->full_name,
            'birth_date' => $this->birth_date,
            'gender' => $this->gender,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'address' => $this->address,
            'status' => $this->status,
            'avatar' => $this->avatar,
            'created_at' => $this->created_at,
            'account_id' => $this->account_id,

            // Relations
            'account' => $this->whenLoaded('account'),
            'position' => $this->whenLoaded('position'),
            'store' => $this->whenLoaded('store'),
            'warehouse' => $this->whenLoaded('warehouse'),
            
        ];
    }
}
