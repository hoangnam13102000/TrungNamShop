<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected static function booted()
    {
        static::retrieved(function ($promotion) {
            $now = now();
            $changed = false;

            if ($promotion->status === 'active' && $now->gt($promotion->end_date)) {
                $promotion->status = 'inactive';
                $changed = true;
            } elseif ($promotion->status === 'inactive' && $now->between($promotion->start_date, $promotion->end_date)) {
                $promotion->status = 'active';
                $changed = true;
            }

            if ($changed) {
                $promotion->save();
            }
        });
    }

    public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }
}
