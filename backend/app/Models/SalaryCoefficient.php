<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryCoefficient extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'salary_coefficients';

    protected $guarded = [];

    /**
     * Relation: Employees
     */
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_salary_coefficient', 'salary_coefficient_id', 'employee_id')
                    ->withTimestamps();
    }
    
    /**
     * Relation: Attendances
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'salary_coefficient_id');
    }
}
