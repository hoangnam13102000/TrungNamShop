<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_code',
        'customer_id',
        'employee_id',
        'discount_id',
        'store_id',
        'recipient_name',
        'recipient_address',
        'recipient_phone',
        'note',
        'delivery_method',
        'payment_method',
        'delivery_date',
        'order_date',
        'payment_status',
        'order_status',
        'final_amount',
        'payment_gateway',
        'transaction_id',
        'payment_response',
    ];

    // Cast các cột datetime để toDateTimeString() luôn hợp lệ
    protected $casts = [
        'delivery_date' => 'datetime',
        'order_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships

    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    public function paypalPayment()
    {
        return $this->hasOne(PaypalPayment::class);
    }
}
