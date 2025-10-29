<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class BatteryCharging extends Model
{
   protected $table = 'batteries_charging'; 
    use HasFactory,SoftDeletes;

    protected $guarded=[];

    // Relation with  productDetails model
     public function productDetails()
    {
        return $this->hasMany(ProductDetail::class,'battery_charging_id');
    }
}
