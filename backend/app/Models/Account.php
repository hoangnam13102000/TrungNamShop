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

    protected $hidden = ['password'];

    //Automatically hash when assigning password
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
}
