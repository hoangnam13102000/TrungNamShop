<?php

namespace App\Models;

use Exception;
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
        'final_price',
        'stock_quantity', // Đây là cột tồn kho
        'promotion_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'final_price' => 'decimal:2',
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
        // Giả sử Promotion có cột 'discount_percent'
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

    // ---------------- STOCK MANAGEMENT LOGIC ----------------

    /**
     * Giảm số lượng tồn kho (stock_quantity) của sản phẩm.
     * Sử dụng atomic decrement để tránh race conditions.
     *
     * @param int $quantityToDecrease Số lượng cần trừ.
     * @throws Exception Nếu số lượng tồn kho không đủ.
     * @return bool
     */
    public function decreaseStock(int $quantityToDecrease): bool
    {
        // 1. Đảm bảo số lượng cần trừ là hợp lệ
        if ($quantityToDecrease <= 0) {
            throw new Exception("Số lượng cần trừ phải lớn hơn 0.");
        }

        // 2. Kiểm tra tồn kho ngay trước khi cập nhật
        if ($this->stock_quantity < $quantityToDecrease) {
            throw new Exception("Lỗi tồn kho: Không đủ số lượng sản phẩm chi tiết #{$this->id}. Cần {$quantityToDecrease}, tồn kho còn {$this->stock_quantity}.");
        }
        
        // 3. Sử dụng decrement (atomic operation)
        // Điều kiện 'where' được thêm vào để đảm bảo số lượng tồn kho >= số lượng muốn trừ
        // Nếu không có row nào được update, nó trả về 0
        $decremented = self::where('id', $this->id) // Sửa $this thành self::
                           ->where('stock_quantity', '>=', $quantityToDecrease)
                           ->decrement('stock_quantity', $quantityToDecrease);

        if (!$decremented) {
            // Trường hợp này xảy ra nếu tồn kho không đủ hoặc race condition xảy ra
            throw new Exception("Lỗi đồng bộ tồn kho: Không thể trừ số lượng sản phẩm chi tiết #{$this->id}. Có thể do tồn kho không đủ hoặc xảy ra tranh chấp dữ liệu.");
        }
        
        // Sau khi decrement, cập nhật lại thuộc tính của Model instance để dùng cho các bước tiếp theo trong Transaction (nếu cần)
        $this->stock_quantity -= $quantityToDecrease;
        
        return true;
    }

    /**
     * Tăng số lượng tồn kho (Sử dụng khi hủy đơn hàng hoặc hoàn trả)
     *
     * @param int $quantityToIncrease
     * @return bool
     */
    public function increaseStock(int $quantityToIncrease): bool
    {
        // Dùng increment (atomic operation)
        $result = $this->increment('stock_quantity', $quantityToIncrease);
        
        // Cập nhật lại thuộc tính của Model instance
        $this->stock_quantity += $quantityToIncrease;
        
        return $result;
    }
}