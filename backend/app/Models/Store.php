<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use HasFactory;

    protected $guarded = [];

     /** ===========================
     * Relationships
     * =========================== */

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
