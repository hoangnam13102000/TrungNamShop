<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GeneralInformation extends Model
{
    protected $table = 'general_informations';
   use HasFactory, SoftDeletes;
    protected $guarded=[]; 

    // Relation with  productDetails model
     public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }
}

