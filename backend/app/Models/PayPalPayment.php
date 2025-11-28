<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaypalPayment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_id',
        'payer_id',
        'amount',
        'is_success',
        'status',
        'error_message'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
