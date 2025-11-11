<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,

            // Relations
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'full_name' => $this->customer->full_name,
                    'phone_number' => $this->customer->phone_number,
                    'email' => $this->customer->email,
                ];
            }),
            'employee' => $this->whenLoaded('employee', function () {
                return [
                    'id' => $this->employee->id,
                    'full_name' => $this->employee->full_name,
                ];
            }),
            'discount' => $this->whenLoaded('discount', function () {
                return [
                    'id' => $this->discount->id,
                    'code' => $this->discount->code,
                    'percentage' => $this->discount->percentage,
                ];
            }),
            'store' => $this->whenLoaded('store', function () {
                return [
                    'id' => $this->store->id,
                    'name' => $this->store->name,
                    'address' => $this->store->address,
                ];
            }),

            // Recipient info
            'recipient_name' => $this->recipient_name,
            'recipient_address' => $this->recipient_address,
            'recipient_phone' => $this->recipient_phone,

            // Other info
            'note' => $this->note,
            'delivery_method' => $this->delivery_method,
            'payment_method' => $this->payment_method,

            // Dates
            'delivery_date' => $this->delivery_date ? $this->delivery_date->toDateTimeString() : null,
            'order_date' => $this->order_date ? $this->order_date->toDateTimeString() : null,

            // Status
            'payment_status' => $this->payment_status,
            'order_status' => $this->order_status,

            // Timestamps
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'deleted_at' => $this->deleted_at ? $this->deleted_at->toDateTimeString() : null,
        ];
    }
}
