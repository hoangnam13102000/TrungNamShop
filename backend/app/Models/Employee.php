<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'employees';
    protected $guarded=[];

    
    /**
     * Relation: tài khoản (Account)
     */
    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    /**
     * Relation: (Position)
     */
    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    /**
     * Relation:  (Store)
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    /**
     * Relation: (Warehouse)
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    /**
     * Relation: (Attendance)
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'employee_id');
    }

    /**
     * Relation: (Reward)
     */
    public function rewards()
    {
        return $this->belongsToMany(Reward::class, 'employee_reward', 'employee_id', 'reward_id')
                    ->withTimestamps();
    }

    /**
     * Relation:  (Allowance)
     */
    public function allowances()
    {
        return $this->belongsToMany(Allowance::class, 'employee_allowance', 'employee_id', 'allowance_id')
                    ->withTimestamps();
    }

    /**
     * Relation: (SalaryCoefficient)
     */
    public function salaryCoefficients()
    {
        return $this->belongsToMany(SalaryCoefficient::class, 'employee_salary_coefficient', 'employee_id', 'salary_coefficient_id')
                    ->withTimestamps();
    }

  
}
