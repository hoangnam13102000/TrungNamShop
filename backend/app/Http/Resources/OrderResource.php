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
        $deliveryMethod = $this->delivery_method ? trim($this->delivery_method) : null;
        $paymentMethod = $this->payment_method ? trim($this->payment_method) : null;
        $orderStatus = $this->order_status ? trim($this->order_status) : null;
        $paymentStatus = $this->payment_status ? trim($this->payment_status) : null;

        // Map label
        $deliveryMethodLabel = match($deliveryMethod) {
            'pickup' => 'Nhận tại cửa hàng',
            'delivery' => 'Giao tận nơi',
            default => '—'
        };

        $paymentMethodLabel = match($paymentMethod) {
            'cash' => 'Tiền mặt',
            'momo' => 'Ví Momo',
            'paypal'=>'Ví Paypal',
            default => '—'
        };

        $orderStatusLabel = match($orderStatus) {
            'pending' => 'Đang chờ',
            'processing' => 'Đang xử lý',
            'shipping' => 'Đang giao',
            'completed' => 'Hoàn thành',
            'cancelled' => 'Đã hủy',
            default => '—'
        };

        $paymentStatusLabel = match($paymentStatus) {
            'unpaid' => 'Chưa thanh toán',
            'paid' => 'Đã thanh toán',
            'refunded' => 'Hoàn tiền',
            default => '—'
        };

        $subtotal = $this->details ? $this->details->sum('subtotal') : 0;
        $discountAmount = 0;
        if ($this->discount) {
            $percentage = $this->discount->percentage > 100 ? 100 : $this->discount->percentage;
            $discountAmount = ($subtotal * $percentage) / 100;
        }

        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'customer_id' => $this->customer_id, // Thêm customer_id để client dễ lọc

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

            // Order Details 
            'details' => OrderDetailResource::collection($this->whenLoaded('details')),

            // Recipient info
            'recipient_name' => $this->recipient_name,
            'recipient_address' => $this->recipient_address,
            'recipient_phone' => $this->recipient_phone,

            // Amount Info 
            'discount_amount' => round($discountAmount, 2),
            'final_amount' => round($this->final_amount, 2),

            // Other info
            'note' => $this->note,
            'payment_gateway' => $this->payment_gateway,
            'transaction_id' => $this->transaction_id,
            'payment_response' => $this->payment_response ? json_decode($this->payment_response) : null,

            // Enum + Label
            'delivery_method' => $deliveryMethod,
            'delivery_method_label' => $deliveryMethodLabel,
            'payment_method' => $paymentMethod,
            'payment_method_label' => $paymentMethodLabel,
            'order_status' => $orderStatus,
            'order_status_label' => $orderStatusLabel,
            'payment_status' => $paymentStatus,
            'payment_status_label' => $paymentStatusLabel,

            // Dates 
            'delivery_date' => $this->delivery_date ? $this->delivery_date->format('Y-m-d') : null,
            'order_date' => $this->order_date ? $this->order_date->toDateTimeString() : null, // Giữ lại DateTimeString cho order_date

            // Timestamps
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'deleted_at' => $this->deleted_at ? $this->deleted_at->toDateTimeString() : null,
        ];
    }
}
