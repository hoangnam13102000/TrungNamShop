<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'attendances';

    protected $guarded = [];

    /**
     * Accessor: final_salary
     */
    public function calculateSalary()
    {
        // Lấy lương cơ bản
        $baseSalary = 0;
        if ($this->employee && $this->employee->position) {
            $baseSalary = floatval($this->employee->position->base_salary ?? 0);
        }

        // Hệ số lương
        $coefficient = 1;
        if ($this->salaryCoefficient) {
            $coefficient = floatval($this->salaryCoefficient->coefficient_value ?? 1);
        }

        // Số ngày đi làm
        $workingDays = floatval($this->work_days ?? 0);
        $standardDays = 26; // ngày chuẩn trong tháng

        // Phụ cấp
        $allowance = 0;
        if ($this->allowance) {
            $allowance = floatval($this->allowance->allowance_amount ?? 0);
        }

        // Thưởng / reward
        $reward = 0;
        if ($this->reward) {
            $reward = floatval($this->reward->reward_money ?? 0);
        }

        // Ứng trước
        $advance = floatval($this->advance_payment ?? 0);

        // Tính lương
        $salary = ($baseSalary * $coefficient * ($workingDays / $standardDays))
            + $allowance
            + $reward
            - $advance;

        // Trả về số nguyên, luôn >= 0
        return max(0, round($salary, 0));
    }




    /**
     * Relation: Nhân viên được chấm công
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    /**
     * Relation: Salary
     */
    public function salaryCoefficient()
    {
        return $this->belongsTo(SalaryCoefficient::class, 'salary_coefficient_id');
    }

    /**
     * Relation: Allowance
     */
    public function allowance()
    {
        return $this->belongsTo(Allowance::class, 'allowance_id');
    }

    /**
     * Relation: Reward
     */
    public function reward()
    {
        return $this->belongsTo(Reward::class, 'reward_id');
    }
}
