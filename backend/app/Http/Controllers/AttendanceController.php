<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Http\Resources\AttendanceResource;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::with([
            'employee.position', 
            'salaryCoefficient',
            'allowance',
            'reward'
        ])->get();

        return response()->json($attendances); 
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'salary_coefficient_id' => 'required|exists:salary_coefficients,id',
            'allowance_id' => 'nullable|exists:allowances,id',
            'reward_id' => 'nullable|exists:rewards,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
            'work_days' => 'required|integer|min:0|max:31',
            'advance_payment' => 'nullable|numeric|min:0',
        ]);

        $attendance = Attendance::create($validated);

        return new AttendanceResource(
            $attendance->load(['employee.position', 'salaryCoefficient', 'allowance', 'reward'])
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       $attendance = Attendance::with([
            'employee.position',
            'salaryCoefficient',
            'allowance',
            'reward',
        ])->findOrFail($id);

        return new AttendanceResource($attendance);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'salary_coefficient_id' => 'required|exists:salary_coefficients,id',
            'allowance_id' => 'nullable|exists:allowances,id',
            'reward_id' => 'nullable|exists:rewards,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000',
            'work_days' => 'required|integer|min:0|max:31',
            'advance_payment' => 'nullable|numeric|min:0',
        ]);

        $attendance->update($validated);

        return new AttendanceResource(
            $attendance->load(['employee.position', 'salaryCoefficient', 'allowance', 'reward'])
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found'], 404);
        }

        $attendance->delete();

        return response()->json(['message' => 'Attendance deleted successfully!']);
    }
}
