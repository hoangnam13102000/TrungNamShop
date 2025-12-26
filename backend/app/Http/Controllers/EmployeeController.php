<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
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

        $employees->transform(function ($e) {
            $e->avatar_url = $e->avatar ? Storage::url($e->avatar) : null;
            return $e;
        });

        return EmployeeResource::collection($employees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id'   => 'required|exists:accounts,id',
            'position_id'  => 'nullable|exists:positions,id',
            'store_id'     => 'nullable|exists:stores,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'full_name'    => 'required|string|max:191',
            'phone_number' => 'nullable|string|max:20',
            'address'      => 'nullable|string|max:255',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_active'    => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        $employee = Employee::create($validated);

        return new EmployeeResource(
            $employee->load(['position', 'store', 'account'])
        );
    }

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

    public function update(Request $request, string $id)
    {
        $employee = Employee::withTrashed()
            ->with('account')
            ->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        $validated = $request->validate([
            'account_id'   => 'sometimes|exists:accounts,id',
            'position_id'  => 'nullable|exists:positions,id',
            'store_id'     => 'nullable|exists:stores,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'full_name'    => 'required|string|max:191',
            'phone_number' => 'nullable|string|max:20',
            'address'      => 'nullable|string|max:255',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_active'    => 'boolean',

            // EMAIL chỉ để update account
            'email' => [
                'nullable',
                'email',
                Rule::unique('accounts', 'email')->ignore($employee->account_id),
            ],
        ]);

        /** AVATAR */
        if ($request->hasFile('avatar')) {
            if ($employee->avatar && Storage::disk('public')->exists($employee->avatar)) {
                Storage::disk('public')->delete($employee->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('employees', 'public');
        }

        /** UPDATE EMAIL TRONG ACCOUNTS */
        if (array_key_exists('email', $validated)) {
            $employee->account->update([
                'email' => $validated['email']
            ]);
            unset($validated['email']); // ❗ KHÔNG lưu vào employee
        }

        $employee->update($validated);

        $employee->avatar_url = $employee->avatar
            ? Storage::url($employee->avatar)
            : null;

        return new EmployeeResource(
            $employee->load(['position', 'store', 'account'])
        );
    }

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
