<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\softDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class ProductImage extends Model
{

    use HasFactory,softDeletes;
    protected $guarded=[];


     public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class, 'product_detail_id');
    }

     public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }
}
