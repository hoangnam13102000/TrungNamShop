<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reward extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded = [];
    
    /**
     * Relation: Attendances
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'reward_id');
    }
}
