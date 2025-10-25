<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
class Color extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded=[];
    
    // Relation with ProductImage model
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    // Relation with  productDetails model
     public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }
}
