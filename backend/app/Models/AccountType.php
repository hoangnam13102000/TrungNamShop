<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class AccountType extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded=[];

    // List of IDs that cannot be deleted/edited
    protected static $protectedIds = [1, 2, 3];

    protected static function booted()
    {
        // Prevent deletion
        static::deleting(function ($type) {
            if (in_array($type->id, self::$protectedIds)) {
                throw new \Exception('Không thể xóa loại tài khoản hệ thống.');
            }
        });

        // Prevent repair
        static::updating(function ($type) {
            if (in_array($type->id, self::$protectedIds)) {
                throw new \Exception('Không thể chỉnh sửa loại tài khoản hệ thống.');
            }
        });
    }
}
