<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountLevel extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];

    // Relation with Accounts model
    public function accounts()
    {
        return $this->hasMany(Account::class, 'account_level_id');
    }

    protected static $protectedIds = [1];
    protected static function booted()
    {
        static::deleting(function ($level) {
            if (in_array($level->id, self::$protectedIds)) {
                throw new \Exception('Không thể xoá Level này.');
            }
        });

        static::updating(function ($level) {
            if (in_array($level->id, self::$protectedIds)) {
                throw new \Exception('Không thể sửa Level này.');
            }
        });
    }
}
