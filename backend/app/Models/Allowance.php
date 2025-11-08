<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Allowance extends Model
{
     use HasFactory, SoftDeletes;

    protected $table = 'allowances';

    protected $guarded = [];

    /**
     * Relation Employyees
     */
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_allowance', 'allowance_id', 'employee_id')
                    ->withTimestamps();
    }
}
