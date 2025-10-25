<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Utility extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'utilities';
    protected $guarded = [];

    // Relation with  productDetails model
     public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }
}
