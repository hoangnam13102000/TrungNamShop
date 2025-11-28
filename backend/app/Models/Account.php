<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Account extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // Allow mass assignment for all fields
    protected $guarded = [];
    protected $appends = ['member_level'];

    // Hide password field
    protected $hidden = ['password'];

    /**
     * Automatically hash password when assigning
     */
    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = bcrypt($value);
        }
    }

    /**
     * Relation to the account_types table
     * Each account belongs to one account type
     */
    public function accountType()
    {
        return $this->belongsTo(AccountType::class, 'account_type_id');
    }

    /**
     * Relation to the account_levels table
     * Each account belongs to one account level
     */
    public function accountLevel()
    {
        return $this->belongsTo(AccountLevel::class, 'account_level_id');
    }

    /**
     * Relation to the customer
     */
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    /**
     * Relation to the employee
     */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * Get member level dynamically based on reward points
     * If account_levels table has min_points column, we select the highest level whose min_points <= reward_points
     */
    public function getMemberLevelAttribute()
    {
        $points = $this->reward_points ?? 0;

        // Find highest level with min_points <= points
        $level = AccountLevel::where('limit', '<=', $points)
            ->orderByDesc('limit')
            ->first();

        // Return level name if found, otherwise default to 'Member'
        return $level ? $level->name : 'Member';
    }
}
