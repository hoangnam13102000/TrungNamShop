<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::with([
            'position',
            'store',
            'warehouse',
            'account',
            'attendances.salaryCoefficient',
            'attendances.allowance',
            'attendances.reward'
        ])->get();
        $employees->transform(function ($c) {
            $c->avatar_url = $c->avatar ? Storage::url($c->avatar) : null;
            return $c;
        });
        return EmployeeResource::collection($employees);
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
            'account_id' => 'nullable|exists:accounts,id',
            'position_id' => 'nullable|exists:positions,id',
            'store_id' => 'nullable|exists:stores,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'full_name' => 'required|string|max:191',
            'phone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:employees,email',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'avatar' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $employee = Employee::create($validated);

        return new EmployeeResource($employee->load(['position']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::with([
            'position',
            'store',
            'warehouse',
            'account',
            'attendances.salaryCoefficient',
            'attendances.allowance',
            'attendances.reward'
        ])->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        return new EmployeeResource($employee);
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
        // Lấy bản ghi kể cả soft deleted
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        // Validation
        $validated = $request->validate([
            'account_id'   => 'nullable|exists:accounts,id',
            'position_id'  => 'nullable|exists:positions,id',
            'store_id'     => 'nullable|exists:stores,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'full_name'    => 'required|string|max:191',
            'phone_number' => 'nullable|string|max:20',
            'email'        => 'nullable|email', 
            'address'      => 'nullable|string|max:255',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_active'    => 'boolean',
        ]);

        // Upload avatar nếu có
        if ($request->hasFile('avatar')) {
            // Xóa avatar cũ nếu cần
            if ($employee->avatar && Storage::disk('public')->exists($employee->avatar)) {
                Storage::disk('public')->delete($employee->avatar);
            }

            $path = $request->file('avatar')->store('employees', 'public');
            $validated['avatar'] = $path;
        }

        // Cập nhật bản ghi
        $employee->update($validated);

        // Thêm url avatar
        $employee->avatar_url = $employee->avatar ? Storage::url($employee->avatar) : null;

        return new EmployeeResource($employee->load(['position']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        $employee->delete();

        return response()->json(['message' => 'Đã xóa nhân viên thành công']);
    }
}
