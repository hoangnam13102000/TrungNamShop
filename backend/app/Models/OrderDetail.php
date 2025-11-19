<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_id',
        'product_detail_id',
        'product_name',
        'detail_info',
        'quantity',
        'price_at_order',
        'subtotal',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    //
    public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class);
    }

    
}
