<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'screen_id',
        'rear_camera_id',
        'front_camera_id',
        'memory_id',
        'operating_system_id',
        'general_information_id',
        'communication_connectivity_id',
        'battery_charging_id',
        'utility_id',
        'price',
        'final_price',        // thêm cột final_price
        'stock_quantity',
        'promotion_id',       // cần để lấy promotion khi tính giá
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'final_price' => 'decimal:2',   // cast final_price
        'stock_quantity' => 'integer',
    ];

    // ---------------- Relationships ----------------
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function screen()
    {
        return $this->belongsTo(Screen::class);
    }

    public function rearCamera()
    {
        return $this->belongsTo(RearCamera::class, 'rear_camera_id', 'id');
    }

    public function frontCamera()
    {
        return $this->belongsTo(FrontCamera::class, 'front_camera_id', 'id');
    }

    public function memory()
    {
        return $this->belongsTo(Memory::class);
    }

    public function operatingSystem()
    {
        return $this->belongsTo(OperatingSystem::class);
    }

    public function generalInformation()
    {
        return $this->belongsTo(GeneralInformation::class, 'general_information_id', 'id');
    }

    public function communicationConnectivity()
    {
        return $this->belongsTo(CommunicationConnectivity::class, 'communication_connectivity_id', 'id');
    }

    public function batteryCharging()
    {
        return $this->belongsTo(BatteryCharging::class, 'battery_charging_id', 'id');
    }

    public function utility()
    {
        return $this->belongsTo(Utility::class, 'utility_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }

    // ---------------- Custom Methods ----------------

    /**
     * Tính giá cuối cùng dựa trên promotion
     */
    public function calculateFinalPrice(): float
    {
        $price = $this->price ?? 0;
        if ($this->promotion?->status === 'active' && $this->promotion->discount_percent) {
            return max($price - ($price * $this->promotion->discount_percent / 100), 0);
        }
        return $price;
    }

    /**
     * Tự động cập nhật final_price trước khi save
     */
    protected static function booted()
    {
        static::saving(function ($detail) {
        if ($detail->isDirty('promotion_id')) {
            $detail->loadMissing('promotion');
        }

        $detail->final_price = $detail->calculateFinalPrice();
    });
    }
}
