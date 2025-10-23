<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\softDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Product extends Model
{
    use HasFactory,softDeletes;
    protected $guarded=[];
    
    // Relation with Brand model
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // Relation with ProductImage model
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}

