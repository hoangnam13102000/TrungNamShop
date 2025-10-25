<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function product() { return $this->belongsTo(Product::class); }
    public function color() { return $this->belongsTo(Color::class); }
    public function screen() { return $this->belongsTo(Screen::class); }
    public function rearCamera() { return $this->belongsTo(RearCamera::class); }
    public function frontCamera() { return $this->belongsTo(FrontCamera::class); }
    public function memory() { return $this->belongsTo(Memory::class); }
    public function operatingSystem() { return $this->belongsTo(OperatingSystem::class); }
    public function generalInformation() { return $this->belongsTo(GeneralInformation::class); }
    public function communicationConnectivity() { return $this->belongsTo(CommunicationConnectivity::class); }
    public function batteryCharging() { return $this->belongsTo(BatteryCharging::class); }
    public function utility() { return $this->belongsTo(Utility::class); }
    public function images(){return $this->hasMany(ProductImage::class);}
}
