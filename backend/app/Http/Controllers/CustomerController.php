<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::with('account');

        if ($request->filled('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        $customers = $query->get();

        // Chuẩn hóa avatar thành URL
        $customers->transform(function ($customer) {
            if ($customer->avatar && !str_starts_with($customer->avatar, 'http')) {
                $customer->avatar = asset('storage/' . $customer->avatar);
            }
            return $customer;
        });

        return response()->json($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id'   => 'required|exists:accounts,id',
            'full_name'    => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('customers', 'public');
            $validated['avatar'] = $path;
        }

        $customer = Customer::create($validated);

        // Cập nhật email của account nếu có
        if ($request->filled('email') && $customer->account) {
            $customer->account->email = $request->email;
            $customer->account->save();
        }

        if ($customer->avatar && !str_starts_with($customer->avatar, 'http')) {
            $customer->avatar = asset('storage/' . $customer->avatar);
        }

        return response()->json([
            'message' => 'Customer created successfully',
            'data'    => $customer->load('account'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with('account')->findOrFail($id);

        if ($customer->avatar && !str_starts_with($customer->avatar, 'http')) {
            $customer->avatar = asset('storage/' . $customer->avatar);
        }

        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::with('account')->findOrFail($id);

        $validated = $request->validate([
            'full_name'    => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('avatar')) {
            if ($customer->avatar && Storage::disk('public')->exists($customer->avatar)) {
                Storage::disk('public')->delete($customer->avatar);
            }
            $path = $request->file('avatar')->store('customers', 'public');
            $validated['avatar'] = $path;
        }

        $customer->update($validated);

        // Cập nhật email của account nếu có
        if ($request->filled('email') && $customer->account) {
            $customer->account->email = $request->email;
            $customer->account->save();
        }

        if ($customer->avatar && !str_starts_with($customer->avatar, 'http')) {
            $customer->avatar = asset('storage/' . $customer->avatar);
        }

        return response()->json([
            'message' => 'Customer updated successfully',
            'data'    => $customer->load('account'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);

        if ($customer->avatar && !str_starts_with($customer->avatar, 'http')) {
            if (Storage::disk('public')->exists($customer->avatar)) {
                Storage::disk('public')->delete($customer->avatar);
            }
        }

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully',
        ]);
    }
}
