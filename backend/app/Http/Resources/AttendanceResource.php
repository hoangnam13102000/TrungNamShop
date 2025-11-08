<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $employee = $this->employee;
        $position = $employee->position ?? null;
        $salaryCoefficient = $this->salaryCoefficient ?? null;
        $allowance = $this->allowance ?? null;
        $reward = $this->reward ?? null;

        $baseSalary = $position->base_salary ?? 0;
        $coefficient = $salaryCoefficient->coefficient_value ?? 1;
        $workDays = $this->work_days ?? 0;
        $standardDays = 26;

        $allowanceAmount = $allowance->allowance_amount ?? 0;
        $rewardAmount = $reward->reward_money ?? 0;
        $advance = $this->advance_payment ?? 0;

        $finalSalary = round(
            $baseSalary * $coefficient * ($workDays / $standardDays)
            + $allowanceAmount
            + $rewardAmount
            - $advance
        );

        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'employee' => new EmployeeResource($this->whenLoaded('employee')),

            'salary_coefficient_id' => $this->salary_coefficient_id,
            'salary_coefficient' => $salaryCoefficient ? [
                'id' => $salaryCoefficient->id,
                'coefficient_name' => $salaryCoefficient->coefficient_name,
                'coefficient_value' => $salaryCoefficient->coefficient_value,
            ] : null,

            'allowance_id' => $this->allowance_id,
            'allowance' => $allowance ? [
                'id' => $allowance->id,
                'allowance_name' => $allowance->allowance_name,
                'allowance_amount' => $allowance->allowance_amount,
            ] : null,

            'reward_id' => $this->reward_id,
            'reward' => $reward ? [
                'id' => $reward->id,
                'reward_name' => $reward->reward_name,
                'reward_money' => $reward->reward_money,
            ] : null,

            'work_days' => $workDays,
            'advance_payment' => $advance,
            'month' => $this->month,
            'year' => $this->year,
            'final_salary' => max(0, $finalSalary), 

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
