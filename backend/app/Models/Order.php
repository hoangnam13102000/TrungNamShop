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
    ];

    protected $dates = [
        'delivery_date',
        'order_date',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Relationships
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
}
